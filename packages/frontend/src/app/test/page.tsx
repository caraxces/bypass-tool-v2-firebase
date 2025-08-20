export default function TestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Test macOS Colors */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">macOS Color Test</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background border border-border rounded-xl p-4">
              <div className="text-sm text-foreground-secondary mb-2">Background</div>
              <div className="text-foreground font-semibold">#f5f5f7</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-sm text-foreground-secondary mb-2">Card</div>
              <div className="text-foreground font-semibold">#ffffff</div>
            </div>
            <div className="bg-primary text-white border border-border rounded-xl p-4">
              <div className="text-sm text-white/80 mb-2">Primary</div>
              <div className="font-semibold">#007aff</div>
            </div>
            <div className="bg-accent text-white border border-border rounded-xl p-4">
              <div className="text-sm text-white/80 mb-2">Accent</div>
              <div className="font-semibold">#34c759</div>
            </div>
          </div>
        </div>

        {/* Test Typography */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">Typography Test</h2>
          <div className="space-y-2">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Gradient Heading
            </h1>
            <p className="text-xl text-foreground-secondary">
              This is secondary text with proper styling
            </p>
            <p className="text-base text-foreground-tertiary">
              This is tertiary text for subtle information
            </p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">Button Test</h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium transition-all duration-200 ease-macos hover:shadow-macos-hover transform hover:scale-105">
              Primary Button
            </button>
            <button className="px-6 py-3 bg-card border border-border hover:bg-background-secondary text-foreground rounded-xl font-medium transition-all duration-200 ease-macos hover:shadow-macos-hover transform hover:scale-105">
              Secondary Button
            </button>
            <button className="px-6 py-3 bg-glass/80 backdrop-blur-md border border-glass-border text-foreground rounded-xl font-medium transition-all duration-200 ease-macos hover:bg-glass hover:shadow-glass-hover transform hover:scale-105">
              Glass Button
            </button>
          </div>
        </div>

        {/* Test Cards */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">Card Test</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-macos-hover transition-all duration-300 ease-macos hover:shadow-macos-hover transform hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">Hover Card</h3>
              <p className="text-foreground-secondary">This card has hover effects</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 animate-fade-in-up">
              <h3 className="text-lg font-semibold text-foreground mb-2">Animated Card</h3>
              <p className="text-foreground-secondary">This card has fade-in animation</p>
            </div>
          </div>
        </div>

        {/* Test Animations */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">Animation Test</h2>
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-primary rounded-xl animate-glow"></div>
            <div className="w-16 h-16 bg-accent rounded-xl animate-float"></div>
            <div className="w-16 h-16 bg-primary/20 rounded-xl animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
