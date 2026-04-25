import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items, address } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    if (!address || typeof address !== "string") {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    // Verify stock for all items
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      
      if (!product || product.stock < item.qty) {
        return NextResponse.json(
          { error: `Insufficient stock for product ${product?.title || item.productId}` },
          { status: 400 }
        );
      }
    }

    const total = items.reduce(
      (sum: number, i: { price: number; qty: number }) => sum + i.price * i.qty,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        address,
        total,
        items: {
          create: items.map((i: { productId: string; qty: number; price: number }) => ({
            productId: i.productId,
            qty: i.qty,
            price: i.price,
          })),
        },
      },
    });

    // Update stock
    await Promise.all(
      items.map((i: { productId: string; qty: number }) =>
        prisma.product.update({
          where: { id: i.productId },
          data: { stock: { decrement: i.qty } },
        })
      )
    );

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
