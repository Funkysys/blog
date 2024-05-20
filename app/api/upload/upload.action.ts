"use server";

import { put } from '@vercel/blob';

export const uploadFile = async (formData: FormData) => {
    console.log(formData);
    const file = formData.get('image') as File;
    console.log(file);
    
    const filename= file.name;

    const blob = await put(filename, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
    })
    return blob.url
}