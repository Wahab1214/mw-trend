'use client';

import * as React from 'react';
import { CustomFieldDefinition, CustomizationValues } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { uploadImageToCloud } from '@/lib/catalog-client';
import { Sparkles, UploadCloud, CheckCircle2 } from 'lucide-react';

export interface CustomizationFormProps {
  fields: CustomFieldDefinition[];
  values: CustomizationValues;
  onChange: (values: CustomizationValues) => void;
  allowCustomerUpload?: boolean;
}

export function CustomizationForm({
  fields,
  values,
  onChange,
  allowCustomerUpload = false,
}: CustomizationFormProps) {
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  const handleFieldChange = (fieldId: string, val: string) => {
    onChange({
      ...values,
      [fieldId]: val,
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadImageToCloud(file, 'customer-uploads');
      onChange({
        ...values,
        customer_upload_url: url,
      });
    } catch (err: any) {
      setUploadError(err?.message || 'Could not upload photo. You can share it on WhatsApp after ordering.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-gold/30 bg-surface/80 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold" />
          <h3 className="font-serif font-bold text-sm sm:text-base text-text-primary">
            Personalize Your Gift
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
          Included
        </span>
      </div>

      <div className="space-y-3.5">
        {fields.map((field) => {
          const val = values[field.id] || '';

          if (field.type === 'text') {
            return (
              <div key={field.id} className="space-y-1">
                <Input
                  label={field.label}
                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                  value={val}
                  maxLength={field.char_limit || 40}
                  required={field.required}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  helperText={
                    field.char_limit
                      ? `${val.length}/${field.char_limit} characters`
                      : undefined
                  }
                />
              </div>
            );
          }

          if (field.type === 'textarea') {
            return (
              <div key={field.id} className="space-y-1">
                <Textarea
                  label={field.label}
                  placeholder={field.placeholder || `Write your ${field.label.toLowerCase()}...`}
                  value={val}
                  charLimit={field.char_limit || 200}
                  required={field.required}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                />
              </div>
            );
          }

          if (field.type === 'select' && field.options) {
            return (
              <div key={field.id} className="space-y-1">
                <Select
                  label={field.label}
                  value={val || field.default || field.options[0]}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  options={field.options.map((opt) => ({ value: opt, label: opt }))}
                />
              </div>
            );
          }

          if (field.type === 'date') {
            return (
              <div key={field.id} className="space-y-1">
                <Input
                  type="date"
                  label={field.label}
                  value={val}
                  required={field.required}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                />
              </div>
            );
          }

          return null;
        })}

        {allowCustomerUpload && (
          <div className="pt-2 border-t border-dashed border-border space-y-2">
            <label className="text-xs font-semibold text-text-secondary uppercase block">
              Upload Photo for Personalization (Optional)
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full flex flex-col items-center justify-center p-4 border border-dashed border-gold/40 rounded-xl bg-elevated/40 text-center hover:bg-elevated transition-colors"
            >
              {values.customer_upload_url ? (
                <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Photo Uploaded! Click to replace</span>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-5 h-5 text-gold mb-1" />
                  <span className="text-xs font-medium text-text-primary">
                    {uploading ? 'Uploading photo...' : 'Choose photo from phone/PC (or send later on WhatsApp)'}
                  </span>
                </>
              )}
            </button>
            {uploadError && <p className="text-[11px] text-amber-500">{uploadError}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
