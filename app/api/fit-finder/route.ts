import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

function calculateSizeLocally(height: number, weight: number, chest?: number, fitPreference?: string) {
  let sizeIndex = 0; // 0=XS, 1=S, 2=M, 3=L, 4=XL, 5=XXL

  // Base size from height
  if (height < 163) sizeIndex = 0;
  else if (height <= 168) sizeIndex = 1;
  else if (height <= 174) sizeIndex = 2;
  else if (height <= 180) sizeIndex = 3;
  else if (height <= 186) sizeIndex = 4;
  else sizeIndex = 5;

  // Override with chest if provided
  if (chest) {
    if (chest < 87) sizeIndex = 0;
    else if (chest <= 92) sizeIndex = 1;
    else if (chest <= 98) sizeIndex = 2;
    else if (chest <= 104) sizeIndex = 3;
    else if (chest <= 110) sizeIndex = 4;
    else sizeIndex = 5;
  }

  // Fit preference adjustment
  if (fitPreference === 'true-oversized') 
    sizeIndex = Math.min(sizeIndex + 1, 5);
  if (fitPreference === 'standard') 
    sizeIndex = Math.max(sizeIndex - 1, 0);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const size = sizes[sizeIndex];

  const explanations: Record<string, string> = {
    XS: "Based on your measurements, XS will give you the best silhouette. Our boxy cut means even XS has a relaxed, oversized feel — not tight.",
    S: "S is your sweet spot. The drop-shoulder cut adds width naturally, so you'll get that oversized look without being swamped in fabric.",
    M: "M is our most popular size. The 240 GSM fabric has enough structure to hold the boxy shape perfectly at this size.",
    L: "L gives you that true heavyweight streetwear look. Roomy without looking sloppy — the drop shoulder keeps it intentional.",
    XL: "XL is for those who want maximum oversized energy. The 240 GSM weight keeps it looking premium, not like a baggy tee.",
    XXL: "XXL delivers the boldest silhouette. Heavy fabric means it drapes properly rather than clinging — exactly the look we designed for."
  };

  return {
    recommendedSize: size,
    explanation: explanations[size],
    isFallback: true
  };
}

export async function POST(request: NextRequest) {
  let height: number = 0;
  let weight: number = 0;
  let chest: number | undefined;
  let shoulder: number | undefined;
  let fitPreference: string = "";
  
  try {
    const body = await request.json();
    height = Number(body.height);
    weight = Number(body.weight);
    chest = body.chest ? Number(body.chest) : undefined;
    shoulder = body.shoulder ? Number(body.shoulder) : undefined;
    fitPreference = body.fitPreference;

    if (!height || !weight || !fitPreference) {
      return NextResponse.json(
        { error: 'Height, weight and fit preference are required' },
        { status: 400 }
      );
    }

    try {
      // Try Groq API first
      console.log('Calling Groq API...');
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `You are a sizing expert for Future Fit, a premium 
            Indian heavyweight streetwear brand. Products use an oversized, 
            drop-shoulder, boxy cut. 
            Size guide:
            XS: Height 155-162cm, Chest 76-86cm
            S: Height 163-168cm, Chest 87-92cm
            M: Height 169-174cm, Chest 93-98cm
            L: Height 175-180cm, Chest 99-104cm
            XL: Height 181-186cm, Chest 105-110cm
            XXL: Height 187cm+, Chest 111cm+
            
            Fit preference rules:
            - true-oversized: size up one from recommendation
            - relaxed: use exact recommendation  
            - standard: size down one from recommendation
            
            Return ONLY a JSON object, no markdown, no extra text:
            {"recommendedSize": "L", "explanation": "2-3 sentences here"}`
          },
          {
            role: "user",
            content: `Height: ${height}cm, Weight: ${weight}kg, 
            Chest: ${chest ? chest + 'cm' : 'not provided'}, 
            Shoulder: ${shoulder ? shoulder + 'cm' : 'not provided'},
            Fit preference: ${fitPreference}`
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      });

      const responseText = completion.choices[0]?.message?.content || '';
      
      // Clean response and parse JSON
      const cleaned = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      
      const result = JSON.parse(cleaned);

      return NextResponse.json({
        recommendedSize: result.recommendedSize,
        explanation: result.explanation,
        isFallback: false
      });

    } catch (groqError) {
      console.error('Groq failed, using fallback:', groqError);
      
      // Fallback to local calculation
      const fallback = calculateSizeLocally(
        Number(height),
        Number(weight),
        chest ? Number(chest) : undefined,
        fitPreference
      );
      
      console.log('Fallback result:', fallback);
      
      return NextResponse.json(fallback);
    }

  } catch (error) {
    console.error('General API error:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Final fallback - local calculation
    const fallback = calculateSizeLocally(
      Number(height),
      Number(weight),
      chest ? Number(chest) : undefined,
      fitPreference
    );
    
    return NextResponse.json(fallback);
  }
}
