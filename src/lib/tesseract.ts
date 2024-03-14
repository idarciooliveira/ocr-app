import * as Tesseract from "tesseract.js";

export async function ExtractText(image: Tesseract.ImageLike): Promise<string> {
    const worker = await Tesseract.createWorker('eng');
    const { data: { text } } = await worker.recognize(image);
    await worker.terminate();
    console.log('image extracted!')
    return text
}