"use client";

type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

interface OrderStatusBadgeProps {
  status: string;
  type?: "order" | "payment";
  className?: string;
}

export default function OrderStatusBadge({ status, type = "order", className = "" }: OrderStatusBadgeProps) {
  const orderStatusConfig = {
    PENDING: {
      label: "Pending",
      className: "bg-gray-100 text-gray-800"
    },
    CONFIRMED: {
      label: "Confirmed", 
      className: "bg-blue-100 text-blue-800"
    },
    PROCESSING: {
      label: "Processing",
      className: "bg-yellow-100 text-yellow-800"
    },
    SHIPPED: {
      label: "Shipped",
      className: "bg-purple-100 text-purple-800"
    },
    DELIVERED: {
      label: "Delivered",
      className: "bg-green-100 text-green-800"
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-red-100 text-red-800"
    },
    REFUNDED: {
      label: "Refunded",
      className: "bg-orange-100 text-orange-800"
    }
  };

  const paymentStatusConfig = {
    PENDING: {
      label: "Pending",
      className: "bg-gray-100 text-gray-800"
    },
    PAID: {
      label: "Paid",
      className: "bg-green-100 text-green-800"
    },
    FAILED: {
      label: "Failed",
      className: "bg-red-100 text-red-800"
    },
    REFUNDED: {
      label: "Refunded",
      className: "bg-orange-100 text-orange-800"
    }
  };

  const config = type === "payment" 
    ? paymentStatusConfig[status as PaymentStatus] || paymentStatusConfig.PENDING
    : orderStatusConfig[status as OrderStatus] || orderStatusConfig.PENDING;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className} ${className}`}>
      {config.label}
    </span>
  );
}