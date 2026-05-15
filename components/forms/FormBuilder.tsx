'use client'

import { useState } from 'react'
import type { FormField } from '@/lib/types/app.types'

const FIELD_TYPES: { value: FormField['type']; label: string }[] = [
  { value: 'text',        label: 'Short Text' },
  { value: 'email',       label: 'Email' },
  { value: 'phone',       label: 'Phone' },
  { value: 'textarea',    label: 'Long Text' },
  { value: 'select',      label: 'Dropdown' },
  { value: 'multiselect', label: 'Multi-select' },
  { value: 'checkbox',    label: 'Checkbox' },
  { value: 'number',      label: 'Number' },
]

interface Props {
  value: FormField[]
  onChange: (fields: FormField[]) => void
}

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

export default function FormBuilder({ value, onChange }: Props) {
  const [preview, setPreview] = useState(false)

  function addField(type: FormField['type']) {
    const field: FormField = {
      id: uid(),
      type,
      label: '',
      required: false,
      placeholder: '',
      options: type === 'select' || type === 'multiselect' ? [] : undefined,
    }
    onChange([...value, field])
  }

  function update(id: string, patch: Partial<FormField>) {
    onChange(value.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }

  function remove(id: string) {
    onChange(value.filter((f) => f.id !== id))
  }

  function moveUp(i: number) {
    if (i === 0) return
    const next = [...value]
    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
    onChange(next)
  }

  function moveDown(i: number) {
    if (i === value.length - 1) return
    const next = [...value]
    ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
    onChange(next)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-300">Registration Form Fields</h3>
        <button
          type="button"
          onClick={() => setPreview(true)}
          className="text-xs text-brand-accent hover:underline"
        >
          Preview Form
        </button>
      </div>

      <div className="space-y-3">
        {value.map((field, i) => (
          <FieldCard
            key={field.id}
            field={field}
            index={i}
            total={value.length}
            onUpdate={(patch) => update(field.id, patch)}
            onRemove={() => remove(field.id)}
            onMoveUp={() => moveUp(i)}
            onMoveDown={() => moveDown(i)}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {FIELD_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => addField(t.value)}
            className="text-xs px-2.5 py-1 rounded border border-brand-muted/30 text-zinc-400 hover:border-brand-accent/40 hover:text-zinc-200 transition-colors"
          >
            + {t.label}
          </button>
        ))}
      </div>

      {preview && <FormPreview fields={value} onClose={() => setPreview(false)} />}
    </div>
  )
}

interface FieldCardProps {
  field: FormField
  index: number
  total: number
  onUpdate: (patch: Partial<FormField>) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

function FieldCard({ field, index, total, onUpdate, onRemove, onMoveUp, onMoveDown }: FieldCardProps) {
  const needsOptions = field.type === 'select' || field.type === 'multiselect'

  return (
    <div className="p-3 rounded-lg border border-brand-muted/20 bg-brand-surface/60 space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex flex-col gap-0.5 shrink-0">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="text-zinc-600 hover:text-zinc-300 disabled:opacity-25 text-xs leading-none"
          >
            ▲
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="text-zinc-600 hover:text-zinc-300 disabled:opacity-25 text-xs leading-none"
          >
            ▼
          </button>
        </div>

        <select
          value={field.type}
          onChange={(e) => onUpdate({ type: e.target.value as FormField['type'] })}
          className="text-xs bg-brand-bg border border-brand-muted/30 rounded px-2 py-1 text-zinc-300 shrink-0"
        >
          {FIELD_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <input
          value={field.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Field label"
          className="flex-1 min-w-0 text-xs bg-brand-bg border border-brand-muted/30 rounded px-2 py-1 text-zinc-200 placeholder-zinc-600"
        />

        <label className="flex items-center gap-1 text-xs text-zinc-400 whitespace-nowrap shrink-0">
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="rounded"
          />
          Required
        </label>

        <button
          type="button"
          onClick={onRemove}
          className="text-zinc-600 hover:text-red-400 text-xs shrink-0"
        >
          ✕
        </button>
      </div>

      {field.type !== 'checkbox' && (
        <input
          value={field.placeholder ?? ''}
          onChange={(e) => onUpdate({ placeholder: e.target.value })}
          placeholder="Placeholder text (optional)"
          className="w-full text-xs bg-brand-bg border border-brand-muted/20 rounded px-2 py-1 text-zinc-400 placeholder-zinc-600"
        />
      )}

      {needsOptions && (
        <textarea
          value={(field.options ?? []).join('\n')}
          onChange={(e) => onUpdate({ options: e.target.value.split('\n').filter(Boolean) })}
          placeholder="One option per line"
          rows={3}
          className="w-full text-xs bg-brand-bg border border-brand-muted/20 rounded px-2 py-1 text-zinc-400 placeholder-zinc-600 resize-none"
        />
      )}
    </div>
  )
}

function FormPreview({ fields, onClose }: { fields: FormField[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-brand-surface border border-brand-muted/20 rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-brand-muted/20 flex items-center justify-between sticky top-0 bg-brand-surface">
          <h3 className="font-semibold text-zinc-200">Form Preview</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200">✕</button>
        </div>
        <div className="p-4 space-y-4">
          {fields.length === 0 && (
            <p className="text-zinc-500 text-sm text-center py-8">No fields added yet</p>
          )}
          {fields.map((field) => (
            <div key={field.id} className="space-y-1">
              <label className="text-sm text-zinc-300">
                {field.label || <span className="italic text-zinc-600">Untitled field</span>}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              {field.type === 'textarea' && (
                <textarea
                  placeholder={field.placeholder}
                  rows={3}
                  disabled
                  className="w-full text-sm bg-brand-bg/50 border border-brand-muted/30 rounded px-3 py-2 text-zinc-400 resize-none"
                />
              )}
              {(field.type === 'select' || field.type === 'multiselect') && (
                <select disabled className="w-full text-sm bg-brand-bg/50 border border-brand-muted/30 rounded px-3 py-2 text-zinc-400">
                  <option>{field.placeholder || 'Select…'}</option>
                  {(field.options ?? []).map((o) => <option key={o}>{o}</option>)}
                </select>
              )}
              {field.type === 'checkbox' && (
                <label className="flex items-center gap-2 text-sm text-zinc-400">
                  <input type="checkbox" disabled className="rounded" />
                  {field.label || 'Checkbox'}
                </label>
              )}
              {!['textarea', 'select', 'multiselect', 'checkbox'].includes(field.type) && (
                <input
                  type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : 'text'}
                  placeholder={field.placeholder}
                  disabled
                  className="w-full text-sm bg-brand-bg/50 border border-brand-muted/30 rounded px-3 py-2 text-zinc-400"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
