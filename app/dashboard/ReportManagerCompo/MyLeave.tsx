"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/Store";
import { leaveTypes, setOrganization } from "@/utils/DataSlice";

import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { MantineProvider } from "@mantine/core";
import { TimePicker } from "@mantine/dates";
import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Calendar,
  Clock,
  CircleAlert,
  CircleCheckBig,
  Divide,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";

import { Allerta } from "next/font/google";
import { date } from "zod";
import DialogCompo from "@/components/DialogCompo";

import DatePicker from "@/components/DatePicker";

const leaveFormSchema = z.object({
  leaveType: z.string().min(1, "Please select a leave type"),
  dayType: z.string().min(1, "Please select a day type"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date().optional(),
  halfDayStartDate: z.date({ required_error: "Please insert start date" }),
  halfDayEndDate: z.date({ required_error: "Please insert end date" }),
  startTime: z.string({ required_error: "Mention your start time" }),
  endTime: z.string({ required_error: "Mention your end time" }),
  timePeriod: z.string().optional(),
  reason: z.string().min(10, "Reason must be at least 10 characters"),
});

type LeaveFormValues = z.infer<typeof leaveFormSchema>;

const MyLeave = () => {
  const leaveTypes = useSelector(
    (state: RootState) => state.dataSlice?.leaveTypes || []
  );

  const selectItems = leaveTypes.map((leave, index) => {
    return {
      color: { backgroundColor: leave.colorCode },
      type: leave.type,
      remained: ``,
    };
  });

  // const selectItems = [
  //   {
  //     color: "w-[0.75rem] h-[0.75rem] bg-red-500 rounded-xl",
  //     type: "Medical Leave",
  //     remained: "(8 remaining)",
  //   },
  //   {
  //     color: "w-[0.75rem] h-[0.75rem] bg-blue-500 rounded-xl",
  //     type: "Earned Leave",
  //     remained: "(7 remaining)",
  //   },
  //   {
  //     color: "w-[0.75rem] h-[0.75rem] bg-green-500 rounded-xl",
  //     type: "Casual Leave",
  //     remained: "(5 remaining)",
  //   },
  // ];

  const cardsData = [
    {
      title: "Remaining Days",
      count: 20,
      icon: <Calendar size={30} />,
      color: "text-blue-600",
    },
    {
      title: "Used Days",
      count: 8,
      icon: <Clock size={30} />,
      color: "text-gray-600",
    },
    {
      title: "Pending",
      count: 1,
      icon: <CircleAlert size={30} />,
      color: "text-orange-600",
    },
    {
      title: "Approved",

      count: 1,
      icon: <CircleCheckBig size={30} />,
      color: "text-green-600",
    },
  ];

  // const dayType = ["Half Day", "Full Day"];
  const dayType = [
    {
      day: "Half Day",
      icon: "w-[1rem] h-[1rem] rounded-full border-1 border-black bg-[linear-gradient(90deg,_black_50%,_white_50%)]",
    },
    {
      day: "Full Day",
      icon: "w-[1rem] h-[1rem] rounded-full border-1 border-black bg-black",
    },
  ];
  // const [startDate, setStartDate] = useState(null);
  const [fullDayStartDate, setFullDayStartDate] = useState<Date | null>(null);
  const [fullDayEndDate, setFullDayEndDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dayTime, setDayTime] = useState<String>();
  const [value, setValue] = useState<Date | null>(new Date());
  const [isOpen, setisOpen] = useState(false);
  const [hasFormInput, setHasFormInput] = useState(false);

  // const chooseYourDay = (day: String) => {
  //   setDayTime(day);
  // };

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      leaveType: "",
      dayType: "",
      reason: "",
      startDate: new Date(), // or new Date() if you want current date as default
      endDate: new Date(),
      halfDayStartDate: undefined,
      halfDayEndDate: undefined,
      startTime: "", // or "09:00" for default time
      endTime: "", // or "17:00" for default time
      timePeriod: undefined,
    },
  });

  useEffect(() => {
    const formTracker = form.watch((formValues) => {
      const isAnyFieldFilled = Object.values(formValues).some(
        (value) => value !== undefined && value !== null && value !== ""
      );
      setHasFormInput(isAnyFieldFilled);
    });
    return () => formTracker.unsubscribe();
  }, [form]);

  console.log(hasFormInput);

  const selectedDayType = form.watch("dayType");

  const onSubmit = (data: LeaveFormValues) => {
    // const { leaveType, dayType, reason } = data;

    try {
      console.log("Form submitted:", data);
      toast.success("Form submit successfully", {
        position: "bottom-right",
        duration: 3000,
        className: "bg-slate-800 text-white",
        style: {
          backgroundColor: "#285943",
          color: "white",
          border: "1px solid #3e5692",
        },
      });
    } catch (error) {
      toast.error("Failed to submit leave application");
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto sm:px-0 lg:px-0 flex flex-col items-center">
      <div className="top w-full flex items-center justify-between flex-wrap mt-5">
        <div className="head">
          <h1 className="font-gilBold text-3xl text-gray-800">
            My Leave Management
          </h1>
          <p className="font-gilMedium text-gray-600 text-sm sm:text-[1rem]">
            Apply for leave and track your leave history
          </p>
        </div>
        <button
          className="cursor-pointer flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-sm"
          onClick={() => setisOpen(true)}
        >
          <i>
            <Plus size={18} />
          </i>{" "}
          <p className="font-gilMedium text-[1rem]">Apply for Leave</p>
        </button>

        <DialogCompo
          isOpen={isOpen}
          onOpenChange={() => setisOpen(false)}
          title="Apply for Leave"
          icon={<Calendar size={20} />}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Leave Type */}
              <FormField
                control={form.control}
                name="leaveType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-gilSemiBold text-gray-800 text-md">
                      Leave Type
                    </FormLabel>

                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className="w-full">
                        <SelectTrigger className="font-gilMedium bg-white py-5 border-[rgba(0,0,0,0.5)]">
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {selectItems.map((item, index) => (
                            <SelectItem
                              value={item.type}
                              key={index}
                              className="px-7 flex justify-between w-full"
                            >
                              <i
                                style={item.color}
                                className={`${item.color} w-[0.75rem] h-[0.75rem] rounded-xl`}
                              ></i>
                              <div className="type font-gilMedium text-[0.95rem]">
                                {item.type}
                              </div>
                              <div className="remaining text-gray-500 font-gilMedium">
                                {item.remained}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Day Type */}
              <FormField
                control={form.control}
                name="dayType"
                render={({ field }) => (
                  <FormItem className="mt-5">
                    <FormLabel className="font-gilSemiBold text-gray-800 text-md">
                      Day Type
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className="w-full">
                        <SelectTrigger className="font-gilMedium bg-white py-5 border-[rgba(0,0,0,0.5)]">
                          <SelectValue placeholder="Select day type" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectGroup>
                          {dayType.map((day, index) => (
                            <SelectItem
                              value={day.day}
                              key={index}
                              className="px-7 w-full"
                            >
                              <div className={`${day.icon}`}></div>
                              <div className="font-gilMedium text-[0.95rem] cursor-pointer">
                                {day.day}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-gilSemiBold text-gray-800">
                      Start Date
                    </FormLabel>
                    <FormControl>
                      {/* <DatePicker field={field} /> */}
                      <input
                        type="text"
                        {...field}
                        value={
                          field.value
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end gap-6 mt-5 btn">
                <div>
                  <Button className="bg-white text-black cursor-pointer border-1 border-[rgba(0,0,0,0.3)] outline-1 px-4 py-5 text-sm font-gilSemiBold rounded-sm cancel">
                    Cancel
                  </Button>
                </div>
                <div className="apply">
                  <Button
                    type="submit"
                    className={`flex items-center gap-3 px-4 py-5 text-sm font-gilSemiBold rounded-sm text-white ${
                      hasFormInput
                        ? "bg-blue-800 hover:bg-blue-900"
                        : "bg-blue-700 opacity-50"
                    }`}
                    // disabled={!hasFormInput}
                  >
                    <Plus size={18} />
                    <span>Apply for Leave</span>
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogCompo>
      </div>

      <div className="w-full mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {cardsData.map((card, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-4 py-5 rounded-md bg-white"
          >
            <div className="left">
              <p className="font-gilSemiBold leading-4 text-slate-600 text-md">
                {card.title}
              </p>
              <p className={`${card.color} font-gilSemiBold text-[1.65rem]`}>
                {card.count}
              </p>
            </div>
            <div className="right">
              <i className={card.color}>{card.icon}</i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyLeave;
