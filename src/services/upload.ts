import axios from 'axios';

// Slug đơn giản tên file (không cần thêm ID)
function slugifyFileName(name: string) {
  const ext = name.substring(name.lastIndexOf('.')); // lấy phần mở rộng .jpg, .png...
  const base = name
    .substring(0, name.lastIndexOf('.'))
    .normalize('NFD') // bỏ dấu
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-') // khoảng trắng thành gạch ngang
    .replace(/[^a-zA-Z0-9-_]/g, '') // bỏ ký tự đặc biệt
    .toLowerCase();

  return `${base}${ext}`;
}

export async function uploadImage(file: File): Promise<string> {
  const fileName = slugifyFileName(file.name);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', fileName);

  const response = await axios.post('/api/image/upload', formData);

  return response.data.path; // /product-img/ca-hoi-sot-ca.jpg
}
