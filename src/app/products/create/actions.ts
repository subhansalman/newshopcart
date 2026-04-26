"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "SELLER") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const categoryId = formData.get("categoryId") as string;
  const tags = (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean);
  const imagesRaw = formData.get("images") as string;
  const images = imagesRaw.split(",").map((u) => u.trim()).filter(Boolean);

  if (!title || !description || !price || !categoryId) {
    throw new Error("Missing required fields");
  }

  const product = await prisma.product.create({
    data: {
      title,
      description,
      price,
      stock: stock || 0,
      categoryId,
      sellerId: session.user.id,
      tags,
      images: images.length > 0 ? images : ["https://picsum.photos/seed/" + Date.now() + "/400/400"],
    },
  });

  revalidatePath("/products");
  revalidatePath("/dashboard/products");
  redirect(`/products/${product.id}`);
}
