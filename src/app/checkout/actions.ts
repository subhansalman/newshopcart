"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createOrder(
  items: { productId: string; qty: number; price: number }[],
  address: string
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Verify stock
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });
    if (!product || product.stock < item.qty) {
      throw new Error(`Insufficient stock for ${product?.title || "product"}`);
    }
  }

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      address,
      total,
      items: {
        create: items.map((i) => ({
          productId: i.productId,
          qty: i.qty,
          price: i.price,
        })),
      },
    },
  });

  // Decrement stock
  await Promise.all(
    items.map((i) =>
      prisma.product.update({
        where: { id: i.productId },
        data: { stock: { decrement: i.qty } },
      })
    )
  );

  revalidatePath("/orders");
  revalidatePath("/products");
  redirect(`/orders/${order.id}`);
}
