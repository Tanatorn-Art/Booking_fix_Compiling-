export function encrypt(data: any): string {
  // ใส่ logic การเข้ารหัสข้อมูล session ตามที่ต้องการ
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

export function decrypt(encryptedData: string): any {
  // ใส่ logic การถอดรหัสข้อมูล session
  return JSON.parse(Buffer.from(encryptedData, 'base64').toString());
}