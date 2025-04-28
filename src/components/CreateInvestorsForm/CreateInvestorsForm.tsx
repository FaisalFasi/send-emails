"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { InvestorformSchema } from "@/lib/investorsFormSchema";
import Select from "react-select";
import "./CreateInvestorsForm.css";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";

// Options for select fields
const industryOptions = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
];

const fundingStageOptions = [
  { value: "pre-seed", label: "Pre-Seed" },
  { value: "seed", label: "Seed" },
  { value: "series-a", label: "Series A" },
];

const locationOptions = [
  { value: "north-america", label: "North America" },
  { value: "europe", label: "Europe" },
  { value: "asia", label: "Asia" },
];

export default function InvestorForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof InvestorformSchema>>({
    resolver: zodResolver(InvestorformSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      type: "",
      industry: [],
      fundingStage: [],
      preferredLocation: [],
      jobTitle: "",
      mobileNumber: "",
      linkedinUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof InvestorformSchema>) {
    console.log("Form values:", values);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/investorsProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Failed to submit form");

      toast.success("Form submitted successfully!");
      form.reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What best describes you?</FormLabel>
              <FormControl>
                <Select
                  options={[
                    { value: "investor", label: "Investor" },
                    { value: "founder", label: "Founder" },
                    { value: "both", label: "Both" },
                  ]}
                  value={industryOptions.find((c) => c.value === field.value)}
                  onChange={(val) => field.onChange(val?.value)}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Industries</FormLabel>
              <FormControl>
                <Select
                  isMulti
                  options={industryOptions}
                  value={industryOptions.filter((opt) =>
                    field.value.includes(opt.value)
                  )}
                  onChange={(options) => {
                    field.onChange(options?.map((opt) => opt.value) || []);
                  }}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fundingStage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Funding Stage</FormLabel>
              <FormControl>
                <Select
                  isMulti
                  options={fundingStageOptions}
                  value={fundingStageOptions.filter((opt) =>
                    field.value.includes(opt.value)
                  )}
                  onChange={(options) => {
                    field.onChange(options?.map((opt) => opt.value) || []);
                  }}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferredLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Locations</FormLabel>
              <FormControl>
                <Select
                  isMulti
                  options={locationOptions}
                  value={locationOptions.filter((opt) =>
                    field.value.includes(opt.value)
                  )}
                  onChange={(options) => {
                    field.onChange(options?.map((opt) => opt.value) || []);
                  }}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="Investment Partner" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-300 hover:bg-green-500 cursor-pointer"
        >
          {isSubmitting ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
}
