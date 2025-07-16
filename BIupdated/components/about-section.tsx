export function AboutSection() {
  return (
    <section id="about" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">About BreachIndex</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            BreachIndex provides a fast, client-side glimpse of potential weaknesses in public-facing sites. It's
            perfect for demos or on-the-go security awareness. Our lightweight analysis helps developers identify common
            security misconfigurations and provides actionable recommendations based on industry best practices.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">⚡</div>
              <h3 className="font-semibold mb-2">Instant Analysis</h3>
              <p className="text-sm text-muted-foreground">Get security insights in seconds, not hours</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">🎯</div>
              <h3 className="font-semibold mb-2">Actionable Results</h3>
              <p className="text-sm text-muted-foreground">Receive specific recommendations you can implement</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">🔒</div>
              <h3 className="font-semibold mb-2">Privacy First</h3>
              <p className="text-sm text-muted-foreground">All analysis happens client-side for maximum privacy</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
