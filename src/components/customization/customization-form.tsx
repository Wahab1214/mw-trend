'use client';

import * as React from 'react';
import { CustomFieldDefinition, CustomizationValues } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Sparkles, UploadCloud, Info } from 'lucide-react';

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
  const isPhase2Enabled = process.env.NEXT_PUBLIC_ENABLE_CUSTOMER_FILE_UPLOAD === 'true';

  const handleFieldChange = (fieldId: string, val: string) => {
    onChange({
      ...values,
      [fieldId]: val,
    });
  };

  return (
    <div className="space-y-4 rounded-xl border border-gold/30 bg-surface/80 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold" />
          <h3 className="font-serif font-bold text-sm sm:text-base text-text-primary">
            Personalize Your Item
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
          Free Custom Printing
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
                  maxLength={field.char_limit || 30}
                  required={field.required}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  helperText={
                    field.char_limit
                      ? `${val.length}/${field.char_limit} characters max. Live preview updates instantly.`
                      : 'Live preview updates as you type.'
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
                  helperText="Carefully review spelling before placing order."
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

        {/* Phase 2: Design Upload (Controlled by feature flag) */}
        {allowCustomerUpload && (
          <div className="pt-2 border-t border-dashed border-border">
            {isPhase2Enabled ? (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary uppercase">
                  Upload Custom Design File (Optional)
                </label>
                <div className="flex flex-col items-center justify-center p-4 border border-dashed border-gold/40 rounded-xl bg-elevated/40 text-center hover:bg-elevated transition-colors cursor-pointer">
                  <UploadCloud className="w-6 h-6 text-gold mb-1" />
                  <span className="text-xs font-medium text-text-primary">Click to upload PNG or SVG (Max 10MB)</span>
                  <span className="text-[10px] text-text-muted mt-0.5">High resolution vector or transparent background recommended</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-elevated/40 text-[11px] text-text-muted">
                <Info className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Custom logo/vector uploads can also be messaged to our WhatsApp design desk after checkout.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
