"use client";
import React, { JSX, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { RootState } from "@/utils/Store";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setOrganization } from "@/utils/DataSlice";

function CreateOrganizationCompo(): JSX.Element {
  const navigate = useRouter();
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();
  const userInfo = useSelector((state: RootState) => state.dataSlice.userInfo);

  const formSchema = z.object({
    organizationName: z
      .string({ required_error: "Organization name is required" })
      .min(1, "Organization name cannot be empty"),
    industryType: z
      .string({ required_error: "Industry type is required" })
      .min(1, "Industry type cannot be empty"),
    organizationDiscription: z
      .string({ required_error: "Organization description is required" })
      .min(1, "Organization description cannot be empty"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
      industryType: "",
      organizationDiscription: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { organizationName, industryType, organizationDiscription } = values;

    startTransition(async () => {
      try {
        const res = await axios.post("/api/CreateOrganization", {
          organizationName,
          industryType,
          organizationDiscription,
          userId: userInfo.id,
        });

        const { success, message, organization } = res.data;

        if (!success) {
          toast.error(message, {
            position: "bottom-right",
            duration: 3000,
            className: "bg-red-700 text-white border border-red-600",
            style: {
              backgroundColor: "#C1292E",
              color: "white",
              border: "1px solid #3e5692",
            },
          });
          return; // early return if not successful
        }

        dispatch(setOrganization(organization));
        toast.success(message, {
          position: "bottom-right",
          duration: 3000,
          className: "bg-green-700 text-white border border-green-600",
          style: {
            backgroundColor: "#285943",
            color: "white",
            border: "1px solid #3e5692",
          },
        });
        navigate.push("/dashboard");
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong", {
          position: "bottom-right",
          duration: 3000,
          className: "bg-red-700 text-white border border-red-600",
          style: {
            backgroundColor: "#C1292E",
            color: "white",
            border: "1px solid #3e5692",
          },
        });
      }
    });
  }

  return (
    <div className="w-full bg-white/80 backdrop-blur-sm rounded-4xl shadow-2xl border border-white/20 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Create Organization
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-600 hover:text-slate-800 cursor-pointer"
          onClick={() => navigate.push("/dashboard")}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-700 font-medium">
                    Organization Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter organization name"
                      className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="industryType"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-700 font-medium">
                    Industry
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="e.g., Technology, Healthcare, Finance"
                      className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="organizationDiscription"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-700 font-medium">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of your organization"
                      className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 cursor-pointer bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            {isPending ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Creating Organization...
              </div>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Create Organization
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default CreateOrganizationCompo;
