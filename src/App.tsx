import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SplashScreen from "./pages/SplashScreen";
import PromiseScreen from "./pages/PromiseScreen";
import NameScreen from "./pages/NameScreen";
import DreamLifeScreen from "./pages/DreamLifeScreen";
import FocusAreasScreen from "./pages/FocusAreasScreen";
import GenerationLoadingScreen from "./pages/GenerationLoadingScreen";
import AffirmationsScreen from "./pages/AffirmationsScreen";
import VoiceRecordingScreen from "./pages/VoiceRecordingScreen";
import CreateAccountScreen from "./pages/CreateAccountScreen";
import ChooseTrackScreen from "./pages/ChooseTrackScreen";
import PreviewScreen from "./pages/PreviewScreen";
import SubscriptionScreen from "./pages/SubscriptionScreen";
import HomePortal from "./pages/HomePortal";
import SettingsScreen from "./pages/SettingsScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("[Vela] Existing session — user ID:", session.user.id);
        return;
      }
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.error("[Vela] Anonymous sign-in failed:", error.message);
      } else {
        console.log("[Vela] Anonymous sign-in — user ID:", data.session?.user.id);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[Vela] Auth state changed:", event, session?.user.id);
    });

    initAuth();

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/promise" element={<PromiseScreen />} />
            <Route path="/name" element={<NameScreen />} />
            <Route path="/dream" element={<DreamLifeScreen />} />
            <Route path="/focus" element={<FocusAreasScreen />} />
            <Route path="/generating" element={<GenerationLoadingScreen />} />
            <Route path="/affirmations" element={<AffirmationsScreen />} />
            <Route path="/voice" element={<VoiceRecordingScreen />} />
            <Route path="/create-account" element={<CreateAccountScreen />} />
            <Route path="/choose-track" element={<ChooseTrackScreen />} />
            <Route path="/preview" element={<PreviewScreen />} />
            <Route path="/subscribe" element={<SubscriptionScreen />} />
            <Route path="/home" element={<HomePortal />} />
            <Route path="/home/returning" element={<HomePortal returning />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
