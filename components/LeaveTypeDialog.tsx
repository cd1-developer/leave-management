import React, { useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "./ui/input";

import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { leaveTypes, setIsFetch, setLeaveTypes } from "@/utils/DataSlice";

interface LeaveTypeDialog {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  discription: string;
  organizationId: string;
  organizationLeaveTypes: leaveTypes[];
}
function LeaveTypeDialog({
  isOpen,
  onOpenChange,
  title,
  discription,
  organizationId,
  organizationLeaveTypes,
}: LeaveTypeDialog) {
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();

  const formSchema = z.object({
    type: z
      .string({
        required_error: "Leave type is required",
      })
      .min(1, "Leave type cannot be empty"),

    leaveInYear: z
      .string({
        required_error: "Leave per year is required",
      })
      .min(1, "Leave per year cannot be empty"),

    leaveInMonth: z.string().optional(),

    colorCode: z
      .string({
        required_error: "Color code is required",
      })
      .min(1, "Color code cannot be empty"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      leaveInYear: "",
      leaveInMonth: "",
      colorCode: "#ff5733",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { type, leaveInYear, leaveInMonth, colorCode } = values;

    startTransition(async () => {
      try {
        const res = await axios.post("/api/addLeaveType", {
          organizationId,
          type,
          leaveInYear,
          leaveInMonth,
          colorCode,
        });

        const { success, message, leaveType } = res.data;

        if (!success) {
          toast.error(message);
          return;
        }
        toast.success(message);
        dispatch(setLeaveTypes([...organizationLeaveTypes, leaveType]));
        dispatch(setIsFetch());
        onOpenChange(false);
      } catch (error: any) {
        console.error("Error adding leave type:", error);
        toast.error("Something went wrong while adding leave type.");
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[95vw] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{discription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-3 sm:space-y-4 py-2 sm:py-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                      Leave Type Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Medical Leave" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="leaveInYear"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                      Days Per Year
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        placeholder="e.g., 10"
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
                name="leaveInMonth"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                      Days Per Month
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        placeholder="e.g., 10"
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
                name="colorCode"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                      Color
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="leaveColor"
                          type="color"
                          className="w-16 h-8 p-0"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700">
                {isPending ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <div>Save</div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default LeaveTypeDialog;
