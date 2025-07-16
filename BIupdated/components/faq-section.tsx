import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Is this a real hacking scanner?",
    answer:
      "It's a front-end demo that provides basic security insights. Full security assessments require comprehensive backend tooling and professional security audits.",
  },
  {
    question: "Will it work on any URL?",
    answer:
      "CORS restrictions may apply when analyzing external domains. For best results, test your own domains or applications you have permission to analyze.",
  },
  {
    question: "How do I harden my app?",
    answer:
      "Use HTTPS everywhere, validate all inputs, implement Content Security Policy, set secure headers, keep dependencies updated, and follow OWASP security guidelines.",
  },
  {
    question: "How accurate are the risk scores?",
    answer:
      "The scores are based on basic heuristics and should be used as a starting point. For production applications, conduct thorough security audits with professional tools.",
  },
  {
    question: "Can I use this for commercial purposes?",
    answer:
      "This is a demonstration tool. For commercial security scanning, consider professional security testing services and enterprise-grade vulnerability scanners.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
