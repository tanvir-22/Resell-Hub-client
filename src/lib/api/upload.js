export async function uploadImage(file) {
  const fd = new FormData();
  fd.append("image", file);
  const res  = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
    { method: "POST", body: fd },
  );
  const json = await res.json();
  if (!json.success) throw new Error("Image upload failed");
  return json.data.url;
}
