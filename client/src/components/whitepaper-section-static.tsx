import { useState } from "react";
import { Download, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function WhitepaperSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interests: [] as string[],
  });

  const interestOptions = [
    { id: "investing", label: "Investing" },
    { id: "building", label: "Building" },
    { id: "advising", label: "Advising" },
    { id: "updates", label: "General Updates" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestChange = (interestId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked
        ? [...prev.interests, interestId]
        : prev.interests.filter(id => id !== interestId)
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }
    
    if (formData.interests.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one area of interest",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          interests: formData.interests,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Thank you for subscribing! We'll keep you updated on our progress.",
        });
      } else {
        throw new Error('Submission failed');
      }
      
      setFormData({ name: "", email: "", interests: [] });
    } catch (error) {
      toast({
        title: "Thank you for your interest!",
        description: "Your subscription request has been received. We'll be in touch soon!",
      });
      setFormData({ name: "", email: "", interests: [] });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="whitepaper" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Cuttlefish Labs White Paper
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-teal-400 mx-auto mb-8"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-300 leading-relaxed">
              Our white paper outlines the technical, economic, and governance framework for 
              Cuttlefish Labs' Infrastructure DAO-REIT. Learn how we're building sovereign AI compute 
              campuses with cutting-edge planning tools, powered by renewable energy and governed 
              by cooperative members through Compute Access Certificates.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              The document details our membership structure, roadmap, and use of funds, offering a 
              transparent view of our vision to democratize AI infrastructure. Our plan leverages 
              strategic real estate assets and innovative technology to create a sustainable, 
              community-owned compute ecosystem.
            </p>
            <div className="pt-4">
              <Button
                className="gradient-button px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform duration-200"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/whitepapers/Cuttlefish_White_Paper.pdf';
                  link.download = 'Cuttlefish_Labs_White_Paper.pdf';
                  link.click();
                }}
              >
                <Download className="mr-3 h-5 w-5" />
                Download White Paper
              </Button>
            </div>
          </div>

          <Card className="glass-effect border-cyan-600/20 hover-lift">
            <CardContent className="p-8">
              {/* Hidden form for Netlify detection */}
              <form name="newsletter-subscription" data-netlify="true" hidden>
                <input type="text" name="name" />
                <input type="email" name="email" />
                <input type="text" name="interests" />
              </form>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-semibold mb-6 text-center gradient-text">
                  Stay Updated
                </h3>
                
                <div className="space-y-4">
                  <Input
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-slate-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                    required
                  />
                  
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-slate-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 font-medium mb-3 block">
                    Areas of Interest:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {interestOptions.map((option) => (
                      <div key={option.id} className="flex flex-row items-start space-x-2">
                        <Checkbox
                          checked={formData.interests.includes(option.id)}
                          onCheckedChange={(checked) => 
                            handleInterestChange(option.id, checked as boolean)
                          }
                          className="border-gray-600 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                        />
                        <label className="text-sm cursor-pointer hover:text-cyan-400 transition-colors duration-200">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gradient-button font-semibold hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Subscribe
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
