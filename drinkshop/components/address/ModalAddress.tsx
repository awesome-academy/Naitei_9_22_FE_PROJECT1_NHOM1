import {
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Address } from "@/types/user.types";
import { useState } from "react";

interface ModalAddressProps {
  addresses: Address[];
  selectedAddress: Address | null;
  onClose: () => void;
  onSelect: (address: Address) => void;
}

const ModalAddress = ({
  addresses,
  selectedAddress,
  onClose,
  onSelect,
}: ModalAddressProps) => {
  const [selectedId, setSelectedId] = useState(selectedAddress?.id || "");

  const handleConfirm = () => {
    const newAddress = addresses.find((addr) => addr.id === selectedId);
    if (newAddress) {
      onSelect(newAddress);
      onClose();
    }
  };

  return (
    <DialogContent>
      <DialogTitle>Chọn địa chỉ giao hàng</DialogTitle>
      <DialogDescription>
        <RadioGroup
          value={selectedId}
          onValueChange={(value) => setSelectedId(value)}
          className="space-y-3 mt-4"
        >
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="flex items-start gap-2 border rounded-md p-3"
            >
              <RadioGroupItem value={addr.id} id={addr.id} />
              <Label htmlFor={addr.id} className="cursor-pointer ">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-600">
                    {addr.address}, {addr.city}, {addr.country}
                  </p>
                  <p className="text-sm text-gray-600">SĐT: {addr.phone}</p>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            className="bg-black hover:bg-gray-800"
            onClick={handleConfirm}
            disabled={!selectedId}
          >
            Xác nhận
          </Button>
        </div>
      </DialogDescription>
    </DialogContent>
  );
};

export default ModalAddress;
