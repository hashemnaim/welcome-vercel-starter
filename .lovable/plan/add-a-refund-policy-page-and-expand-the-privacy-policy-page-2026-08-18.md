Add a Refund Policy page and expand the Privacy Policy page

Goal
- Create a new Refund Policy page reachable at `/legal/refund`.
- Replace the current minimal Privacy Policy content with the detailed Arabic copy provided by the user, while keeping the page bilingual and RTL-friendly.
- Surface both pages in the site footer and routing.

Files to change
1. `src/pages/Refund.tsx` (new)
   - Same layout as `Terms.tsx` and `Privacy.tsx`: Header, Seo, bilingual main content, Footer.
   - Arabic title: "سياسة الاسترداد" / English: "Refund Policy".
   - Route meta: `/legal/refund`.
   - Content sections: eligibility, refund window, refund method, non-refundable items, cancellation process, contact.
2. `src/pages/Privacy.tsx`
   - Replace the three short sections with the full 10-section Arabic copy provided by the user.
   - Keep English translations for each section to match existing bilingual behavior.
   - Use a clean numbered list layout consistent with the provided copy.
   - Update contact email to `support@shoplancer.com` (as provided) in the Arabic copy; keep `hello@shoplanser.com` in the English fallback or align with the user-provided email.
3. `src/App.tsx`
   - Add lazy import for `Refund`.
   - Add `<Route path="/legal/refund" element={<Refund />} />` next to the other legal routes.
4. `src/components/layout/Footer.tsx`
   - Add a "Refund Policy" link ("سياسة الاسترداد") in the Important Links column, pointing to `/legal/refund`.
   - Keep existing Privacy and Terms links.

Design/structure
- Reuse the existing `container-page py-16` layout, `dir={isAr ? "rtl" : "ltr"}` switching, and `font-arabic` class for Arabic text.
- Sections use `<section>` with `<h2>` headings and readable paragraphs/lists.
- No new dependencies or backend changes required.

Validation
- Run `bun run build` to verify no routing or TypeScript errors.
- Visit `/legal/refund` and `/legal/privacy` in the preview to confirm RTL rendering and footer links.
