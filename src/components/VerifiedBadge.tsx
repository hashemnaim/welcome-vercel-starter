import { BadgeCheck, Star, Zap, MessageCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  size?: "sm" | "md";
  className?: string;
}

export const VerifiedBadge = ({
  size = "sm",
  className,
}: VerifiedBadgeProps) => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const criteria = isAr
    ? [
        { icon: Star, text: "تقييم أعلى من 4.7 ⭐" },
        { icon: Zap, text: "مبيعات نشطة ومستمرة" },
        { icon: MessageCircle, text: "ردود سريعة على العملاء" },
      ]
    : [
        { icon: Star, text: "Rating above 4.7 ⭐" },
        { icon: Zap, text: "Active & consistent sales" },
        { icon: MessageCircle, text: "Fast customer responses" },
      ];

  return (
    <Tooltip delayDuration={150}>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={
            isAr
              ? "متجر موثّق - اضغط لرؤية المعايير"
              : "Verified merchant - hover for criteria"
          }
          className={cn(
            "inline-flex cursor-help items-center gap-1 rounded-full bg-primary/15 font-semibold text-primary ring-1 ring-inset ring-primary/30 transition-all hover:bg-primary/25 hover:ring-primary/50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary",
            size === "sm"
              ? "px-1.5 py-0.5 text-[10px]"
              : "px-2.5 py-1 text-xs backdrop-blur",
            className,
          )}
        >
          <BadgeCheck className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
          <span className={size === "sm" ? "hidden sm:inline" : ""}>
            {isAr ? "موثّق" : "Verified"}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        align="center"
        className="max-w-[260px] border-primary/20 bg-popover p-0 shadow-elevated"
      >
        <div className="space-y-2 p-3">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <BadgeCheck className="h-4 w-4 text-primary" />
            <p className="text-sm font-bold text-foreground">
              {isAr ? "متجر موثّق" : "Verified Merchant"}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            {isAr
              ? "هذا المتجر يستوفي معاييرنا للجودة:"
              : "This merchant meets our quality standards:"}
          </p>
          <ul className="space-y-1.5">
            {criteria.map((c, i) => {
              const Icon = c.icon;
              return (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-foreground"
                >
                  <Icon className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" />
                  <span>{c.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
