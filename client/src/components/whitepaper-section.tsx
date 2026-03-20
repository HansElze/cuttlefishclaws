import { useState } from "react";
import { Download, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertSubscriptionSchema, type InsertSubscription } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function WhitepaperSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const interestOptions = [
    { id: "investing", label: "Investing" },
    { id: "building", label: "Building" },
    { id: "advising", label: "Advising" },
    { id: "updates", label: "General Updates" },
  ];

  const form = useForm<InsertSubscription>({
    resolver: zodResolver(insertSubscriptionSchema),
    defaultValues: {
      name: "",
      email: "",
      interests: [],
    },
  });

  const onSubmit = async (data: InsertSubscription) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('form-name', 'newsletter-subscription');
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('interests', data.interests.join(', '));

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Thank you for subscribing! We'll keep you updated on our progress.",
        });
        form.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      toast({
        title: "Thank you for your interest!",
        description: "Your subscription request has been received. We'll be in touch soon!",
      });
      form.reset();
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
                  window.open("/whitepapers/Cuttlefish_White_Paper.pdf", "_blank");
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
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <h3 className="text-2xl font-semibold mb-6 text-center gradient-text">
                    Stay Updated
                  </h3>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Your Name"
                              {...field}
                              className="bg-slate-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Your Email"
                              {...field}
                              className="bg-slate-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="interests"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-400 font-medium">
                          Areas of Interest:
                        </FormLabel>
                        <div className="grid grid-cols-2 gap-3">
                          {interestOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="interests"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        const currentValue = field.value || [];
                                        const newValue = checked
                                          ? [...currentValue, option.id]
                                          : currentValue.filter((value) => value !== option.id);
                                        field.onChange(newValue);
                                      }}
                                      className="border-gray-600 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm cursor-pointer hover:text-cyan-400 transition-colors duration-200">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
