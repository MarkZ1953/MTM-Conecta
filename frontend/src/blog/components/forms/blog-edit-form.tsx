import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { blogPostEditSchema } from "@/blog/blog.schemas";
import { blogAPI } from "@/blog/blog.api";
import { toast } from "@/components";
import type { BlogPost, BlogPostPayload } from "@/blog/blog.types";
import { BlogFormFields } from "./blog-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type BlogEditFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  post: BlogPost | null;
  setRefresh: SetRefresh;
};

const formatDateTimeLocal = (dateStr?: string | null) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

const getDefaultValues = (post?: BlogPost | null): BlogPostPayload => ({
  title: post?.title ?? "",
  slug: post?.slug ?? "",
  summary: post?.summary ?? "",
  content: post?.content ?? "",
  image_alt: post?.image_alt ?? "",
  published_at: formatDateTimeLocal(post?.published_at),
  status: post?.status ?? "draft",
  image_upload: null,
});

export const BlogEditForm = ({ open, setOpen, post, setRefresh }: BlogEditFormProps) => {
  const form = useForm<BlogPostPayload>({
    resolver: yupResolver(blogPostEditSchema),
    defaultValues: getDefaultValues(post),
  });

  useEffect(() => {
    if (open) form.reset(getDefaultValues(post));
  }, [form, open, post]);

  const closeDialog = () => {
    setOpen(false);
    form.reset(getDefaultValues(post));
  };

  const onSubmit = async (data: BlogPostPayload) => {
    if (!post) return;

    try {
      const { status, data: responseData } = await blogAPI.update({
        id: post.id,
        data,
      });

      if (status >= 200 && status < 300) {
        toast.success("Publicación actualizada correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo actualizar la publicación.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar la publicación.");
    }
  };

  const footer = (
    <div className="flex justify-content-end gap-2 pt-2">
      <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" outlined onClick={closeDialog} disabled={form.formState.isSubmitting} />
      <Button type="submit" label={form.formState.isSubmitting ? "Guardando..." : "Guardar"} icon={form.formState.isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-save"} onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting || !post} />
    </div>
  );

  return (
    <Dialog
      header="Editar publicación"
      visible={open}
      onHide={closeDialog}
      modal
      draggable={false}
      className="w-11 md:w-8 lg:w-6"
      contentStyle={{ padding: "0 1.5rem 1rem" }}
      footer={footer}
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <BlogFormFields existingImageUrl={post?.image_url ?? ""} />
        </form>
      </FormProvider>
    </Dialog>
  );
};
