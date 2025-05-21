"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

import Button from "@/components/buttons/Button";
import ArrowBackward from "@/components/icons/ArrowBackward";
import GeneralCard from "@/components/cards/GeneralCard";
import useStore from "@/store/useStore";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");
  const planId = searchParams.get("planId");
  const accountId = searchParams.get("accountId");

  const { setSelectedPlan, setSelectedClient, setIsTopup } = useStore();

  useEffect(() => {
    setSelectedPlan(null);
    setSelectedClient(null);
    setIsTopup(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GeneralCard title="Order Confirmation" className="text-center">
      <>
        <div>
          <p>Order ID: {orderId}</p>
          <p>Plan ID: {planId}</p>
          <p>Account ID: {accountId}</p>
        </div>
        <Link href="/dashboard">
          <Button
            variant="secondary"
            label="Go back to dashboard"
            child={<ArrowBackward />}
            childrenPosition="left"
          />
        </Link>
      </>
    </GeneralCard>
  );
}
