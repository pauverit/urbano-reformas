import { NextResponse } from "next/server";
import { model, generationConfig } from "@/lib/gemini";

export const runtime = "edge";

export async function POST(req: Request) {
    try {
        const { image, mimeType } = await req.json();

        if (!image || !mimeType) {
            return NextResponse.json(
                { error: "Image and mimeType are required" },
                { status: 400 }
            );
        }

        const prompt = `Actúa como un experto en reformas. Analiza la imagen adjunta de esta cocina/baño. Identifica: 
1. Metros lineales estimados de encimera. 
2. Número de puntos de luz/enchufes visibles. 
3. Estado de las paredes (necesita alisado o no).
Devuelve exclusivamente un objeto JSON con las llaves: items, quantity, unit, confidence_score.`;

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                data: image,
                                mimeType: mimeType,
                            },
                        },
                    ],
                },
            ],
            generationConfig,
        });

        const response = result.response;
        const text = response.text();

        return NextResponse.json(JSON.parse(text));
    } catch (error: any) {
        console.error("Error analyzing image:", error);
        return NextResponse.json(
            { error: "Failed to analyze image", details: error.message },
            { status: 500 }
        );
    }
}
