"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Coffee,
  Menu,
  X,
  Sun,
  Moon,
  Settings,
  Milk,
  Thermometer,
  GlassWater,
  Clock,
  ChevronDown,
  ChevronUp,
  Info,
  Github,
  Heart,
  CupSoda,
  Beer,
  FlaskRound,
  Check,
} from "lucide-react";

interface Recipe {
  id: string;
  name: string;
  description: string;
  milk: boolean;
  temperature: string[];
  cupTypes: string[];
  grindSizeRange: number[];
  chocolate: boolean;
  proportions: Record<string, string>;
  instructions: string[];
  brewTime: string;
}

interface CupType {
  id: string;
  name: string;
  description: string;
  capacity: string;
  icon: string;
}

interface GrindSize {
  level: number;
  name: string;
  description: string;
  bestFor: string[];
}

interface CoffeeData {
  recipes: Recipe[];
  cupTypes: CupType[];
  grindSizes: GrindSize[];
}

interface SettingsConfig {
  grindLevels: number;
  defaultGrindSize: number;
}

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isCupDropdownOpen, setIsCupDropdownOpen] = useState(false);
  const [coffeeData, setCoffeeData] = useState<CoffeeData | null>(null);
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  const [withMilk, setWithMilk] = useState<boolean | "any">("any");
  const [withChocolate, setWithChocolate] = useState<boolean | "any">("any");
  const [temperature, setTemperature] = useState<"hot" | "cold" | "any">("any");
  const [selectedCupType, setSelectedCupType] = useState<string>("any");
  const [grindSize, setGrindSize] = useState<number | "any">("any");

  const [settings, setSettings] = useState<SettingsConfig>({
    grindLevels: 6,
    defaultGrindSize: 3,
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("coffee-theme");
    const savedSettings = localStorage.getItem("coffee-settings");
    
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    }
    
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      setGrindSize(parsed.defaultGrindSize);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("coffee-theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    fetch("/coffee-recipes.json")
      .then((res) => res.json())
      .then((data) => setCoffeeData(data))
      .catch((err) => console.error("Failed to load recipes:", err));
  }, []);

  const saveSettings = useCallback((newSettings: SettingsConfig) => {
    setSettings(newSettings);
    localStorage.setItem("coffee-settings", JSON.stringify(newSettings));
  }, []);

  const filteredRecipes = coffeeData?.recipes.filter((recipe) => {
    const matchesMilk = withMilk === "any" || recipe.milk === withMilk;
    const matchesChocolate = withChocolate === "any" || recipe.chocolate === withChocolate;
    const matchesTemp = temperature === "any" || recipe.temperature.includes(temperature);
    const matchesCup = selectedCupType === "any" || recipe.cupTypes.includes(selectedCupType);
    const matchesGrind =
      grindSize === "any" ||
      (typeof grindSize === "number" &&
        grindSize >= recipe.grindSizeRange[0] &&
        grindSize <= recipe.grindSizeRange[1]);

    return matchesMilk && matchesChocolate && matchesTemp && matchesCup && matchesGrind;
  });

  const getGrindSizeInfo = (level: number) => {
    return coffeeData?.grindSizes.find((g) => g.level === level);
  };

  const getCupTypeInfo = (id: string) => {
    return coffeeData?.cupTypes.find((c) => c.id === id);
  };

  const getCupIcon = (iconName?: string, className = "h-4 w-4") => {
    switch (iconName) {
      case "coffee":
        return <Coffee className={className} />;
      case "cup-soda":
        return <CupSoda className={className} />;
      case "beer":
        return <Beer className={className} />;
      case "glass-water":
        return <GlassWater className={className} />;
      case "flask-round":
        return <FlaskRound className={className} />;
      default:
        return <GlassWater className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Coffee className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">Coffee Builder</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDark(!isDark)}
              className="rounded-full p-2 transition-colors hover:bg-muted"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="rounded-full p-2 transition-colors hover:bg-muted"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="rounded-full p-2 transition-colors hover:bg-muted"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Hero Section */}
        <section className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">
            Build Your Perfect Cup
          </h1>
          <p className="text-muted-foreground">
            Select your preferences and discover ideal coffee recipes
          </p>
        </section>

        {/* Filters Section */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Milk Toggle */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Milk className="h-4 w-4" />
              <span>Milk</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setWithMilk("any")}
                className={`flex-1 rounded-lg px-2 py-2 text-sm font-medium transition-all ${
                  withMilk === "any"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Any
              </button>
              <button
                onClick={() => setWithMilk(false)}
                className={`flex-1 rounded-lg px-2 py-2 text-sm font-medium transition-all ${
                  withMilk === false
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                No Milk
              </button>
              <button
                onClick={() => setWithMilk(true)}
                className={`flex-1 rounded-lg px-2 py-2 text-sm font-medium transition-all ${
                  withMilk === true
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                With Milk
              </button>
            </div>
          </div>

          {/* Chocolate Toggle */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CupSoda className="h-4 w-4" />
              <span>Chocolate</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setWithChocolate("any")}
                className={`flex-1 rounded-lg px-2 py-2 text-sm font-medium transition-all ${
                  withChocolate === "any"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Any
              </button>
              <button
                onClick={() => setWithChocolate(false)}
                className={`flex-1 rounded-lg px-2 py-2 text-sm font-medium transition-all ${
                  withChocolate === false
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                No
              </button>
              <button
                onClick={() => setWithChocolate(true)}
                className={`flex-1 rounded-lg px-2 py-2 text-sm font-medium transition-all ${
                  withChocolate === true
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Yes!
              </button>
            </div>
          </div>

          {/* Temperature Toggle */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Thermometer className="h-4 w-4" />
              <span>Temperature</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setTemperature("any")}
                className={`flex-1 rounded-lg px-2 py-2 text-sm font-medium transition-all ${
                  temperature === "any"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Any
              </button>
              <button
                onClick={() => setTemperature("hot")}
                className={`flex-1 rounded-lg px-2 py-2 text-sm font-medium transition-all ${
                  temperature === "hot"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                🔥 Hot
              </button>
              <button
                onClick={() => setTemperature("cold")}
                className={`flex-1 rounded-lg px-2 py-2 text-sm font-medium transition-all ${
                  temperature === "cold"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                ❄️ Cold
              </button>
            </div>
          </div>

          {/* Cup Type Selector */}
          <div className="relative rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <GlassWater className="h-4 w-4" />
              <span>Cup Type</span>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setIsCupDropdownOpen(!isCupDropdownOpen)}
                onBlur={() => setTimeout(() => setIsCupDropdownOpen(false), 200)}
                className="flex w-full items-center justify-between rounded-lg border border-border bg-muted px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <div className="flex items-center gap-2">
                  {selectedCupType === "any" ? (
                    <>
                      <GlassWater className="h-4 w-4 text-muted-foreground" />
                      <span>Any Cup Type</span>
                    </>
                  ) : (
                    <>
                      {getCupTypeInfo(selectedCupType as string)?.icon && (
                        <img
                          src={getCupTypeInfo(selectedCupType as string)?.icon}
                          alt=""
                          className="h-4 w-4 text-primary"
                        />
                      )}
                      <span>{getCupTypeInfo(selectedCupType as string)?.name}</span>
                    </>
                  )}
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isCupDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isCupDropdownOpen && (
                <div className="absolute left-0 top-full z-10 mt-1 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg ring-1 ring-black/5">
                  <div className="max-h-60 overflow-y-auto py-1">
                    <button
                      onClick={() => {
                        setSelectedCupType("any");
                        setIsCupDropdownOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted ${
                        selectedCupType === "any" ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      <GlassWater className="h-4 w-4" />
                      <span className="flex-1 text-left">Any Cup Type</span>
                      {selectedCupType === "any" && <Check className="h-3 w-3" />}
                    </button>
                    
                    {coffeeData?.cupTypes.map((cup) => (
                      <button
                        key={cup.id}
                        onClick={() => {
                          setSelectedCupType(cup.id);
                          setIsCupDropdownOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-muted ${
                          selectedCupType === cup.id ? "bg-primary/10 text-primary" : ""
                        }`}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                          <img
                            src={cup.icon}
                            alt={cup.name}
                            className="h-5 w-5 opacity-70"
                          />
                        </div>
                        <div className="flex flex-1 flex-col items-start">
                          <span className="font-medium">{cup.name}</span>
                          <span className="text-xs text-muted-foreground">{cup.capacity}</span>
                        </div>
                        {selectedCupType === cup.id && <Check className="h-3 w-3" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Grind Size Slider */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Coffee className="h-4 w-4" />
                <span>Grind Size</span>
              </div>
              <span className="text-xs font-semibold text-primary">
                {grindSize === "any" ? "Any" : getGrindSizeInfo(grindSize)?.name}
              </span>
            </div>
            <div className="mb-2 flex justify-end">
              <button
                onClick={() => setGrindSize(grindSize === "any" ? settings.defaultGrindSize : "any")}
                className={`rounded-md px-2 py-1 text-xs font-medium transition-all ${
                  grindSize === "any"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Any
              </button>
            </div>
            <input
              type="range"
              min="1"
              max={settings.grindLevels}
              value={grindSize === "any" ? settings.defaultGrindSize : grindSize}
              onChange={(e) => setGrindSize(parseInt(e.target.value))}
              disabled={grindSize === "any"}
              className={`w-full accent-primary ${grindSize === "any" ? "opacity-40" : ""}`}
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>Fine</span>
              <span>Coarse</span>
            </div>
          </div>
        </section>

        {/* Current Selection Summary */}
        <section className="mb-6 rounded-xl border border-border bg-card/50 p-4">
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">
            Your Selection
          </h2>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {withMilk === "any" ? "Any Milk" : withMilk ? "With Milk" : "No Milk"}
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {withChocolate === "any" ? "Any Choc" : withChocolate ? "🍫 Chocolate" : "No Chocolate"}
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {temperature === "any" ? "Any Temp" : temperature === "hot" ? "🔥 Hot" : "❄️ Cold"}
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {selectedCupType === "any" ? "Any Cup" : getCupTypeInfo(selectedCupType)?.name}
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Grind: {grindSize === "any" ? "Any" : getGrindSizeInfo(grindSize)?.name}
            </span>
          </div>
        </section>

        {/* Recipes Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Matching Recipes</h2>
            <span className="text-sm text-muted-foreground">
              {filteredRecipes?.length || 0} found
            </span>
          </div>

          {filteredRecipes && filteredRecipes.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
                >
                  <div
                    className="cursor-pointer p-4"
                    onClick={() =>
                      setExpandedRecipe(
                        expandedRecipe === recipe.id ? null : recipe.id
                      )
                    }
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="text-lg font-semibold">{recipe.name}</h3>
                      {expandedRecipe === recipe.id ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">
                      {recipe.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{recipe.brewTime}</span>
                    </div>
                  </div>

                  {expandedRecipe === recipe.id && (
                    <div className="border-t border-border bg-muted/30 p-4">
                      <div className="mb-4">
                        <h4 className="mb-2 text-sm font-semibold">
                          Proportions
                        </h4>
                        <div className="space-y-1">
                          {Object.entries(recipe.proportions).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between text-sm"
                              >
                                <span className="capitalize text-muted-foreground">
                                  {key}:
                                </span>
                                <span className="font-medium">{value}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-2 text-sm font-semibold">
                          Instructions
                        </h4>
                        <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                          {recipe.instructions.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <Coffee className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No Recipes Found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters to discover more coffee options
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Hamburger Menu Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="relative ml-auto h-full w-80 max-w-full bg-card p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="rounded-full p-2 transition-colors hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsAboutOpen(true);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-muted"
              >
                <Info className="h-5 w-5" />
                <span>About</span>
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSettingsOpen(true);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-muted"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-muted"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>
            </nav>

            <div className="absolute bottom-6 left-6 right-6">
              <div className="rounded-lg bg-muted p-4 text-center text-sm text-muted-foreground">
                <Coffee className="mx-auto mb-2 h-6 w-6" />
                <p>
                  Made with <Heart className="inline h-4 w-4 text-red-500" /> for
                  coffee lovers
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsSettingsOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold">Settings</h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-full p-2 transition-colors hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Grind Size Levels
                </label>
                <p className="mb-3 text-xs text-muted-foreground">
                  Set the number of grind levels available (1 = finest, max =
                  coarsest)
                </p>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={settings.grindLevels}
                  onChange={(e) =>
                    saveSettings({
                      ...settings,
                      grindLevels: parseInt(e.target.value),
                    })
                  }
                  className="w-full accent-primary"
                />
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>3 levels</span>
                  <span className="font-semibold text-primary">
                    {settings.grindLevels} levels
                  </span>
                  <span>10 levels</span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Default Grind Size
                </label>
                <p className="mb-3 text-xs text-muted-foreground">
                  Set your preferred default grind size
                </p>
                <input
                  type="range"
                  min="1"
                  max={settings.grindLevels}
                  value={settings.defaultGrindSize}
                  onChange={(e) => {
                    const newDefault = parseInt(e.target.value);
                    saveSettings({
                      ...settings,
                      defaultGrindSize: newDefault,
                    });
                    setGrindSize(newDefault);
                  }}
                  className="w-full accent-primary"
                />
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>Fine (1)</span>
                  <span className="font-semibold text-primary">
                    Level {settings.defaultGrindSize}
                  </span>
                  <span>Coarse ({settings.grindLevels})</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsAboutOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold">About Coffee Builder</h2>
              <button
                onClick={() => setIsAboutOpen(false)}
                className="rounded-full p-2 transition-colors hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex justify-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <Coffee className="h-12 w-12 text-primary" />
                </div>
              </div>

              <p className="text-center">
                <strong className="text-foreground">Coffee Builder</strong> helps
                you discover and craft the perfect cup of coffee based on your
                preferences.
              </p>

              <div className="rounded-lg bg-muted p-4">
                <h3 className="mb-2 font-semibold text-foreground">Features</h3>
                <ul className="list-inside list-disc space-y-1">
                  <li>Filter by milk preference</li>
                  <li>Choose hot or cold drinks</li>
                  <li>Select your cup type</li>
                  <li>Adjust grind size</li>
                  <li>Detailed recipes with proportions</li>
                  <li>Step-by-step instructions</li>
                </ul>
              </div>

              <p className="text-center text-xs">
                Built with Next.js, Tailwind CSS, and a love for coffee.
                <br />
                <span className="text-primary">coffeebuilder.dev</span>
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsAboutOpen(false)}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-6">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Coffee Builder. Brew with{" "}
            <Heart className="inline h-4 w-4 text-red-500" /> at{" "}
            <span className="font-medium text-primary">coffeebuilder.dev</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
