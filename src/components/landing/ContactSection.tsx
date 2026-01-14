import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Send, CheckCircle2, User, Mail, Building2, Phone, MessageCircle } from "lucide-react";

const ContactSection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    source: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.company || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission (replace with actual API call)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Thank you! We'll be in touch soon.");
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-muted/50 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg glow-primary animate-bounce-subtle">
              <CheckCircle2 className="h-12 w-12 text-primary-foreground" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              Thank You!
            </h2>
            <p className="text-xl text-muted-foreground">
              We'll reach out within 24 hours to discuss how Upkeeply can help
              your building.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-muted/50 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
              Let's Talk About <span className="gradient-text">Your Building</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Fill this out, and we'll show you how Upkeeply can save your team 10+ hours every week.
            </p>
          </div>

          <div className="bg-card rounded-3xl p-8 md:p-10 border border-border shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-semibold">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="pl-12 py-6 text-lg bg-muted border-border focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-semibold">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-12 py-6 text-lg bg-muted border-border focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-foreground font-semibold">Company / Building Name *</Label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="company"
                    placeholder="Property management company or building name"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="pl-12 py-6 text-lg bg-muted border-border focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-semibold">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="pl-12 py-6 text-lg bg-muted border-border focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source" className="text-foreground font-semibold">How did you find us?</Label>
                <div className="relative">
                  <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                  <Select
                    value={formData.source}
                    onValueChange={(value) =>
                      setFormData({ ...formData, source: value })
                    }
                  >
                    <SelectTrigger className="pl-12 py-6 text-lg bg-muted border-border">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Search</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="referral">Referral from a colleague</SelectItem>
                      <SelectItem value="event">Industry event</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gradient-accent text-accent-foreground font-bold text-xl py-7 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 glow-accent"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <>
                    Contact Us
                    <Send className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                We respect your privacy. Your information will only be used to
                contact you about Upkeeply.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
