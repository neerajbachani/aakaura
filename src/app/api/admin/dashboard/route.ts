import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/middleware/auth";

export async function GET(request: NextRequest) {
  try {
    const adminUser = await verifyAdminToken(request);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current month and last month dates
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total Revenue (current month)
    const currentMonthRevenue = await prisma.order.aggregate({
      where: {
        status: { in: ["DELIVERED", "SHIPPED"] },
        createdAt: { gte: currentMonthStart }
      },
      _sum: { total: true }
    });

    // Last month revenue for comparison
    const lastMonthRevenue = await prisma.order.aggregate({
      where: {
        status: { in: ["DELIVERED", "SHIPPED"] },
        createdAt: { gte: lastMonthStart, lte: lastMonthEnd }
      },
      _sum: { total: true }
    });

    // Total Orders (current month)
    const currentMonthOrders = await prisma.order.count({
      where: { createdAt: { gte: currentMonthStart } }
    });

    const lastMonthOrders = await prisma.order.count({
      where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } }
    });

    // Total Users (current month)
    const currentMonthUsers = await prisma.user.count({
      where: { createdAt: { gte: currentMonthStart } }
    });

    const lastMonthUsers = await prisma.user.count({
      where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } }
    });

    // Total Products
    const totalProducts = await prisma.product.count();
    const inStockProducts = await prisma.product.count({
      where: {
        variations: {
          some: { inStock: true }
        }
      }
    });

    // Pending Orders
    const pendingOrders = await prisma.order.count({
      where: { status: "PENDING" }
    });

    // Recent Orders (last 10)
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: { select: { quantity: true } }
      }
    });

    // Calculate percentage changes
    const revenueChange = lastMonthRevenue._sum.total 
      ? ((currentMonthRevenue._sum.total || 0) - lastMonthRevenue._sum.total) / lastMonthRevenue._sum.total * 100
      : 0;

    const ordersChange = lastMonthOrders 
      ? (currentMonthOrders - lastMonthOrders) / lastMonthOrders * 100
      : 0;

    const usersChange = lastMonthUsers 
      ? (currentMonthUsers - lastMonthUsers) / lastMonthUsers * 100
      : 0;

    return NextResponse.json({
      stats: {
        revenue: {
          current: currentMonthRevenue._sum.total || 0,
          change: revenueChange
        },
        orders: {
          current: currentMonthOrders,
          change: ordersChange
        },
        users: {
          current: currentMonthUsers,
          change: usersChange
        },
        products: {
          total: totalProducts,
          inStock: inStockProducts,
          outOfStock: totalProducts - inStockProducts
        }
      },
      pendingOrders,
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.user.name || order.user.email,
        total: order.total,
        status: order.status,
        itemsCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
        createdAt: order.createdAt
      }))
    });

  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}