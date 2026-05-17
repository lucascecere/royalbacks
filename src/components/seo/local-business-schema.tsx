interface LocalBusinessSchemaProps {
  schema: Record<string, unknown>
}

export function LocalBusinessSchema({ schema }: LocalBusinessSchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
