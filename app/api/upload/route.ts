import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = path.extname(originalName);
    const fileName = `${timestamp}-${originalName}`;
    
    // บันทึกไฟล์
    const filePath = path.join(process.cwd(), 'public', 'CourseFiles', fileName);
    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      fileName,
      originalName,
      fileSize: file.size,
      fileType: file.type
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
} 