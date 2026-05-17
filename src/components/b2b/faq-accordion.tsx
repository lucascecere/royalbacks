'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { buildFaqSchema } from '@/src/lib/seo'

interface FaqItem {
  question: string
  answer: string
}

interface FaqAccordionProps {
  items: FaqItem[]
  className?: string
}

export function FaqAccordion({ items, className }: FaqAccordionProps) {
  const schema = buildFaqSchema(items)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Accordion.Root
        type="single"
        collapsible
        className={`space-y-2 ${className ?? ''}`}
      >
        {items.map((item, i) => (
          <Accordion.Item
            key={i}
            value={String(i)}
            className="border border-rb-border rounded-sm overflow-hidden"
          >
            <Accordion.Header>
              <Accordion.Trigger className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-rb-navy font-medium hover:bg-rb-surface transition-colors group">
                <span>{item.question}</span>
                <ChevronDown className="w-4 h-4 flex-shrink-0 text-rb-muted transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="px-5 pb-4 text-rb-muted text-sm leading-relaxed data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
              {item.answer}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </>
  )
}
