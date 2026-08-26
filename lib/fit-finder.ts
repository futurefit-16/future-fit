export type Gender = "male" | "female";
export type BodyShape = "slim" | "regular" | "athletic" | "broad";
export type FitSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export interface FitInput {
    gender: Gender;
    heightCm: number;
    weightKg: number;
    bodyShape: BodyShape;
    chestCm?: number;
    waistCm?: number;
}

interface SizeRange {
    size: FitSize;
    minBmi: number;
    maxBmi: number;
}

const MALE_RANGES: SizeRange[] = [
    { size: "XS", minBmi: 0, maxBmi: 17.5 },
    { size: "S", minBmi: 17.5, maxBmi: 20 },
    { size: "M", minBmi: 20, maxBmi: 23 },
    { size: "L", minBmi: 23, maxBmi: 26 },
    { size: "XL", minBmi: 26, maxBmi: 29 },
    { size: "XXL", minBmi: 29, maxBmi: 100 },
];

const FEMALE_RANGES: SizeRange[] = [
    { size: "XS", minBmi: 0, maxBmi: 17 },
    { size: "S", minBmi: 17, maxBmi: 19.5 },
    { size: "M", minBmi: 19.5, maxBmi: 22.5 },
    { size: "L", minBmi: 22.5, maxBmi: 25.5 },
    { size: "XL", minBmi: 25.5, maxBmi: 28.5 },
    { size: "XXL", minBmi: 28.5, maxBmi: 100 },
];

const SHAPE_OFFSET: Record<BodyShape, number> = {
    slim: -0.5,
    regular: 0,
    athletic: 0.5,
    broad: 1.0,
};

export interface FitResult {
    size: FitSize;
    bmi: number;
    confidence: "high" | "medium";
    tip: string;
}

export function recommendSize(input: FitInput): FitResult {
    const heightM = input.heightCm / 100;
    const rawBmi = input.weightKg / (heightM * heightM);
    const adjustedBmi = rawBmi + SHAPE_OFFSET[input.bodyShape];

    const ranges = input.gender === "male" ? MALE_RANGES : FEMALE_RANGES;
    let matched: FitSize = "M";
    for (const r of ranges) {
        if (adjustedBmi >= r.minBmi && adjustedBmi < r.maxBmi) {
            matched = r.size;
            break;
        }
    }

    const hasDetailedMeasurements = Boolean(input.chestCm || input.waistCm);
    const confidence = hasDetailedMeasurements ? "high" : "medium";

    const tips: Record<BodyShape, string> = {
        slim: "For a relaxed look, consider going one size up.",
        regular: "Standard sizing should work well for you.",
        athletic: "Look for athletic-fit or stretch fabrics for comfort.",
        broad: "Opt for relaxed-fit styles for the best comfort.",
    };

    return {
        size: matched,
        bmi: Math.round(rawBmi * 10) / 10,
        confidence,
        tip: tips[input.bodyShape],
    };
}
