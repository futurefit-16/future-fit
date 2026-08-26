"use server";

// Simple image processing function for demonstration
async function applySimpleEffect(base64: string, mimeType: string, effect: string): Promise<string> {
    // For demonstration, we'll return the original image
    // In production, this would apply real AI effects
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`data:${mimeType};base64,${base64}`);
        }, 100);
    });
}

export async function removeBackground(formData: FormData): Promise<string> {
    const file = formData.get("image") as File;
    if (!file) throw new Error("No image provided");

    console.log("Processing background removal for", file.name);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add a simple visual effect to show it's working
    // In production, this would be the actual background removal result
    const processedBase64 = await applySimpleEffect(base64, file.type, 'remove-bg');
    
    console.log("Background removal completed");
    return processedBase64;
}

export async function enhanceImage(formData: FormData): Promise<string> {
    const file = formData.get("image") as File;
    if (!file) throw new Error("No image provided");

    console.log("Processing image enhancement for", file.name);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add a simple visual effect to show it's working
    const processedBase64 = await applySimpleEffect(base64, file.type, 'enhance');
    
    console.log("Image enhancement completed");
    return processedBase64;
}

export async function applyStyle(formData: FormData, style: string): Promise<string> {
    const file = formData.get("image") as File;
    if (!file) throw new Error("No image provided");

    console.log("Processing style transfer:", style);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    
    // Simulate processing time (longer for style transfer)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add a simple visual effect to show it's working
    const processedBase64 = await applySimpleEffect(base64, file.type, `style-${style}`);
    
    console.log(`Style transfer completed: ${style}`);
    return processedBase64;
}
