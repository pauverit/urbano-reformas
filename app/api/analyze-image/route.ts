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

        const prompt = `Actúa como un experto en reformas y construcción. Analiza la imagen adjunta, que puede ser una foto de una estancia (cocina/baño) o un BOCETO/DIBUJO hecho a mano con medidas.

Identifica y extrae:
1. Metros lineales de encimera o paredes.
2. Número de puntos de luz, enchufes o tomas de agua.
3. Tareas necesarias (alisar paredes, demolición, alicatado, etc.).
4. Si hay un dibujo con medidas, extrae las dimensiones para calcular superficies.

Devuelve EXCLUSIVAMENTE un objeto JSON con esta estructura:
{
  "confidence_score": "Alta/Media/Baja",
  "items": [
    { "item": "Descripción de la tarea o material", "quantity": número, "unit": "m/m2/ud/ml", "price": 0 }
  ]
}
No incluyas explicaciones, solo el JSON.`;

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
