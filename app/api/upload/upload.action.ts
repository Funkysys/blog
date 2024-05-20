"use server";

import { put } from '@vercel/blob';

export const uploadFile = async (formData: FormData) => {
    const file = formData.get('image') as File;
    
    const filename= file.name;

    const blob = await put(filename, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
    })
    return blob.url
}