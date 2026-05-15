import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function EnquireDialog({
  open,
  onOpenChange,
  packageName,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  packageName?: string;
}) {
  const [interest, setInterest] = useState(packageName ?? "Sponsorship");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-0 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl tracking-wide">
            ENQUIRE NOW
          </DialogTitle>
          <DialogDescription>
            {packageName
              ? `Tell us about your interest in the ${packageName} package.`
              : "Our team will be in touch within 24 hours."}
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Enquiry sent. Our team will reach out shortly.");
            onOpenChange(false);
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="d-name">Name</Label>
              <Input id="d-name" required className="bg-background/50" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="d-company">Company</Label>
              <Input id="d-company" required className="bg-background/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="d-email">Email</Label>
              <Input id="d-email" type="email" required className="bg-background/50" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="d-phone">Phone</Label>
              <Input id="d-phone" className="bg-background/50" />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Interested in</Label>
            <Select value={interest} onValueChange={setInterest}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sponsorship">Sponsorship</SelectItem>
                <SelectItem value="Marketing Services">Marketing Services</SelectItem>
                <SelectItem value="Both">Both</SelectItem>
                {packageName && (
                  <SelectItem value={packageName}>{packageName}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="d-msg">Message</Label>
            <Textarea id="d-msg" rows={3} className="bg-background/50" />
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full">
            Send Enquiry
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
