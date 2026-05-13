import { CreateView } from "@/components/refine-ui/views/create-view.tsx";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useBack } from "@refinedev/core";
import { Separator } from "@/components/ui/separator.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

import { zodResolver } from "@hookform/resolvers/zod";
import {useForm } from "@refinedev/react-hook-form"
import * as z from "zod";

import { classSchema } from "@/lib/schema.ts";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

import { Textarea } from "@/components/ui/textarea.tsx";

import { Loader2 } from "lucide-react";
import UploadWidget from "@/components/upload-widget";
import { UploadWidgetValue } from "@/types";

const Create = () => {
  const back = useBack();

  const form = useForm<z.infer<typeof classSchema>>({
    refineCoreProps: {
      resource: "classes",
      action: "create",
    },
    resolver: zodResolver(classSchema) as never, // may be buggy bcz no generics support in useForm, but it works fine
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = form;

  const onSubmit = async (values: z.infer<typeof classSchema>) => {
    try {
      console.log(values);

      // api call here
    } catch (error) {
      console.error("Error creating class:", error);
    }
  };

  const teachers = [
    {
      id: 1,
      name: "John Doe",
    },
    {
      id: 2,
      name: "Jane Doe",
    },
  ];

  const subjects = [
    {
      id: 1,
      name: "Math",
      code: "MATH",
    },
    {
      id: 2,
      name: "English",
      code: "ENG",
    },
  ];

  const bannerPublicId = form.watch("bannerCldPubId");
  const setBannerImage = (
    file: UploadWidgetValue | null,
    field: { onChange: (value: string) => void },
  ) => {
    if (file) {
      field.onChange(file.url);
      form.setValue("bannerCldPubId", file.publicId, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      field.onChange("");
      form.setValue("bannerCldPubId", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };
  return (
    <CreateView className="class-view">
      <Breadcrumb />

      <h1 className="page-title">Create a Class</h1>

      <div className="intro-row">
        <p>Provide the required information below to add a class.</p>

        <Button type="button" variant="outline" onClick={() => back()}>
          Go Back
        </Button>
      </div>

      <Separator />

      <div className="my-4 flex items-center justify-center">
        <Card className="class-form-card w-full max-w-4xl">
          <CardHeader className="relative z-10">
            <CardTitle className="pb-0 text-2xl font-bold text-gradient-orange">
              Fill out form
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="mt-7">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit as never)} className="space-y-5">
                {/* Banner Image */}

                <FormField
                  control={control}
                  name="bannerUrl"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>
                          Banner Image{" "}
                          <span className="text-orange-600">*</span>
                        </FormLabel>

                        <FormControl>
                          <UploadWidget
                            value={
                              field.value
                                ? {
                                    url: field.value,
                                    publicId: bannerPublicId ?? "",
                                  }
                                : null
                            }
                            onChange={(file: UploadWidgetValue | null) =>
                              setBannerImage(file, field)
                            }
                          />
                        </FormControl>

                        <FormMessage />

                        {errors.bannerCldPubId && !errors.bannerUrl && (
                          <p className="text-sm text-red-600">
                            {errors.bannerCldPubId.message?.toString()}
                          </p>
                        )}
                      </FormItem>
                    );
                  }}
                />
                {/* Class Name */}
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Class Name <span className="text-orange-600">*</span>
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="Introduction to Biology - Section A"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Subject + Teacher */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Subject */}
                  <FormField
                    control={control}
                    name="subjectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Subject <span className="text-orange-600">*</span>
                        </FormLabel>

                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem
                                key={subject.id}
                                value={subject.id.toString()}
                              >
                                {subject.name} ({subject.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Teacher */}
                  <FormField
                    control={control}
                    name="teacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Teacher <span className="text-orange-600">*</span>
                        </FormLabel>

                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a teacher" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {teachers.map((teacher) => (
                              <SelectItem
                                key={teacher.id}
                                value={teacher.id.toString()}
                              >
                                {teacher.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Capacity + Status */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Capacity */}
                  <FormField
                    control={control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>

                        <FormControl>
                          <Input
                            type="number"
                            placeholder="30"
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const value = e.target.value;

                              field.onChange(value ? Number(value) : undefined);
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Status */}
                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Status <span className="text-orange-600">*</span>
                        </FormLabel>

                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>

                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>

                      <FormControl>
                        <Textarea
                          placeholder="Brief description about the class"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <span>Creating Class...</span>

                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    "Create Class"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  );
};

export default Create;
