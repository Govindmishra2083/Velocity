"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, AlertCircle } from "lucide-react"

interface PaymentModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  tripTitle: string
  tripPrice: string
  onConfirmPayment: () => void
}

export default function PaymentModal({
  isOpen,
  onOpenChange,
  tripTitle,
  tripPrice,
  onConfirmPayment,
}: PaymentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-black via-gray-900 to-black border-gray-800/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Confirm Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Trip</p>
                <p className="text-xl font-bold text-white">{tripTitle}</p>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Amount to Pay</p>
                  <p className="text-2xl font-bold text-green-400">₹{tripPrice}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-500/10 border-orange-500/30">
            <CardContent className="p-3 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-orange-300">
                This payment is required to confirm your participation in this guided ride. You'll be added to the group
                chat after payment.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <p className="text-sm text-gray-400">Payment Method</p>
            <div className="grid grid-cols-3 gap-2">
              {["UPI", "Card", "Net Banking"].map((method) => (
                <Button
                  key={method}
                  variant="outline"
                  className="bg-gray-900/50 border-gray-700 hover:border-purple-500 hover:bg-purple-500/10"
                >
                  {method}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirmPayment()
              onOpenChange(false)
            }}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
