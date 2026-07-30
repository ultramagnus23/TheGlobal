"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  enquiryFormSchema,
  roleOptions,
  interestOptions,
  type EnquiryFormValues,
} from "@/lib/schemas/enquiry";
import { submitEnquiry } from "@/app/actions/enquiry";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";

const fieldClasses =
  "min-h-14 w-full rounded-xl border-[1.5px] border-border-interactive bg-surface px-4 text-lg text-ink focus:border-navy-600";
const labelClasses = "block text-lg font-medium text-ink mb-2";
const errorClasses = "mt-2 text-base text-danger flex items-center gap-1.5";

export function EnquiryForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquiryFormSchema),
    mode: "onBlur",
  });

  async function onSubmit(values: EnquiryFormValues) {
    setSubmitError(null);
    const result = await submitEnquiry(values);
    if (result.ok) {
      router.push("/contact/thank-you");
    } else {
      setSubmitError(result.error ?? "Something went wrong. Please call us instead.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Honeypot — visually hidden without an extreme offset, which was previously blowing out the
          document's layout width (fixed-position headers stretch to the enlarged layout viewport). */}
      <div className="absolute h-px w-px overflow-hidden opacity-0 -z-10" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <div>
        <label htmlFor="name" className={labelClasses}>
          Name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          className={fieldClasses}
          aria-describedby={errors.name ? "name-error" : undefined}
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name ? (
          <p id="name-error" className={errorClasses}>
            <span aria-hidden="true">✕</span> {errors.name.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="phone" className={labelClasses}>
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          className={fieldClasses}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          aria-invalid={!!errors.phone}
          {...register("phone")}
        />
        {errors.phone ? (
          <p id="phone-error" className={errorClasses}>
            <span aria-hidden="true">✕</span> {errors.phone.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="city" className={labelClasses}>
          City
        </label>
        <input
          id="city"
          type="text"
          autoComplete="address-level2"
          className={fieldClasses}
          aria-describedby={errors.city ? "city-error" : undefined}
          aria-invalid={!!errors.city}
          {...register("city")}
        />
        {errors.city ? (
          <p id="city-error" className={errorClasses}>
            <span aria-hidden="true">✕</span> {errors.city.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="role" className={labelClasses}>
          I am a…
        </label>
        <select id="role" className={fieldClasses} {...register("role")}>
          <option value="">Select one</option>
          {roleOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.role ? (
          <p className={errorClasses}>
            <span aria-hidden="true">✕</span> {errors.role.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="interest" className={labelClasses}>
          Interested in
        </label>
        <select id="interest" className={fieldClasses} {...register("interest")}>
          <option value="">Select one</option>
          {interestOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.interest ? (
          <p className={errorClasses}>
            <span aria-hidden="true">✕</span> {errors.interest.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="message" className={labelClasses}>
          Message <span className="font-normal text-ink-tertiary">(optional)</span>
        </label>
        <textarea id="message" rows={4} className={cn(fieldClasses, "min-h-28 py-3")} {...register("message")} />
      </div>

      {submitError ? (
        <p className={errorClasses} role="alert">
          <span aria-hidden="true">✕</span> {submitError}
        </p>
      ) : null}

      <Button type="submit" tier="primary" size="large" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Sending…" : "Send Enquiry"}
      </Button>
    </form>
  );
}
