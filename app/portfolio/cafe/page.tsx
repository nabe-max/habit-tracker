"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Coffee,
  Mail,
  MapPin,
  Menu,
  Phone,
  Users,
  Wifi,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  cafeInfo,
  galleryImages,
  menuCategories,
  storeFeatures,
} from "@/data/cafe-content";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#menu", label: "Menu" },
  { href: "#gallery", label: "Gallery" },
  { href: "#info", label: "Info" },
  { href: "#contact", label: "Contact" },
  { href: "#reserve", label: "Reserve" },
];

export default function CafePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleReserve = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("ご予約リクエストを受け付けました（デモ）", {
      description: "ポートフォリオ用のため、実際には送信されません。",
    });
    (e.target as HTMLFormElement).reset();
  };

  const handleContact = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("お問い合わせを受け付けました（デモ）", {
      description: "ポートフォリオ用のため、実際には送信されません。",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="bg-[#FAF6F1] text-[#3D2B1F]">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#E8DDD0] bg-[#FAF6F1]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="#top" className="flex items-center gap-2">
            <Coffee className="size-6 text-[#8B6914]" />
            <div>
              <p className="font-[family-name:var(--font-cafe-serif)] text-lg font-semibold text-[#3D2B1F]">
                {cafeInfo.name}
              </p>
              <p className="text-[10px] tracking-[0.2em] text-[#8B6914]">
                {cafeInfo.nameEn}
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-[#666] transition-colors hover:text-[#8B6914]"
              >
                {link.label}
              </a>
            ))}
            <Button
              asChild
              className="rounded-full bg-[#8B6914] hover:bg-[#7A5F12]"
            >
              <a href="#reserve">予約する</a>
            </Button>
          </nav>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="メニュー"
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="border-t border-[#E8DDD0] px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="py-2 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button asChild className="rounded-full bg-[#8B6914]">
                <a href="#reserve" onClick={() => setMobileOpen(false)}>
                  予約する
                </a>
              </Button>
            </div>
          </nav>
        )}
      </header>

      {/* Hero */}
      <section id="top" className="relative min-h-[90vh] pt-16">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&q=80"
            alt="カフェ店内"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#3D2B1F]/50" />
        </div>
        <div className="relative flex min-h-[calc(90vh-4rem)] flex-col items-center justify-center px-4 text-center text-white">
          <p className="text-xs tracking-[0.4em] text-[#E8D5A3]">SINCE 2015</p>
          <h1 className="mt-4 font-[family-name:var(--font-cafe-serif)] text-4xl font-semibold sm:text-6xl">
            {cafeInfo.name}
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/90">
            {cafeInfo.tagline}
          </p>
          <Button
            asChild
            size="lg"
            className="mt-10 rounded-full bg-[#8B6914] px-10 hover:bg-[#7A5F12]"
          >
            <a href="#reserve">
              <Calendar className="size-4" />
              席を予約する
            </a>
          </Button>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle en="MENU" ja="メニュー" />
          <div className="mt-14 grid gap-12 md:grid-cols-2">
            {menuCategories.map((cat) => (
              <div key={cat.name}>
                <h3 className="border-b-2 border-[#8B6914] pb-2 font-[family-name:var(--font-cafe-serif)] text-xl text-[#8B6914]">
                  {cat.label}
                </h3>
                <ul className="mt-6 space-y-5">
                  {cat.items.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-start justify-between gap-4"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="mt-1 text-xs text-[#999]">{item.desc}</p>
                      </div>
                      <p className="shrink-0 font-[family-name:var(--font-cafe-serif)] text-lg text-[#8B6914]">
                        {item.price}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle en="GALLERY" ja="フォトギャラリー" />
          <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {galleryImages.map((img) => (
              <button
                key={img.src}
                type="button"
                className="group relative aspect-square overflow-hidden rounded-lg"
                onClick={() => setSelectedImage(img.src)}
              >
                <Image
                  src={`https://images.unsplash.com/${img.src}?w=600&q=80`}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#3D2B1F]/0 transition-colors group-hover:bg-[#3D2B1F]/20" />
              </button>
            ))}
          </div>
        </div>

        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              type="button"
              className="absolute right-4 top-4 text-white"
              onClick={() => setSelectedImage(null)}
              aria-label="閉じる"
            >
              <X className="size-8" />
            </button>
            <div className="relative aspect-square w-full max-w-2xl">
              <Image
                src={`https://images.unsplash.com/${selectedImage}?w=1200&q=80`}
                alt="ギャラリー"
                fill
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        )}
      </section>

      {/* Store Info + Map */}
      <section id="info" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle en="INFORMATION" ja="店舗情報" />
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="rounded-xl border border-[#E8DDD0] bg-white p-8">
                <dl className="space-y-5 text-sm">
                  <InfoItem icon={MapPin} label="住所" value={cafeInfo.address} />
                  <InfoItem icon={Phone} label="電話" value={cafeInfo.phone} />
                  <InfoItem icon={Clock} label="平日" value={cafeInfo.hours.weekday} />
                  <InfoItem icon={Clock} label="土日祝" value={cafeInfo.hours.weekend} />
                  <InfoItem icon={Calendar} label="定休日" value={cafeInfo.hours.closed} />
                  <InfoItem icon={Users} label="席数" value={cafeInfo.seats} />
                </dl>
              </div>
              <div className="flex flex-wrap gap-3">
                {storeFeatures.map((f) => (
                  <span
                    key={f.label}
                    className="flex items-center gap-2 rounded-full border border-[#E8DDD0] bg-white px-4 py-2 text-xs"
                  >
                    {f.label === "Wi-Fi" && <Wifi className="size-3.5 text-[#8B6914]" />}
                    <span className="font-medium">{f.label}</span>
                    <span className="text-[#999]">{f.desc}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-[#E8DDD0]">
              <iframe
                src={cafeInfo.mapEmbedUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reservation */}
      <section id="reserve" className="bg-[#3D2B1F] py-20 text-white sm:py-28">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <SectionTitle en="RESERVATION" ja="ご予約" light />
          <p className="mt-4 text-center text-sm text-white/70">
            2日前までのご予約をお願いします。当日予約はお電話にて。
          </p>
          <form
            onSubmit={handleReserve}
            className="mt-10 space-y-5 rounded-xl bg-white/10 p-8 backdrop-blur-sm"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="お名前" id="r-name" required>
                <Input
                  id="r-name"
                  required
                  placeholder="山田 花子"
                  className="rounded-lg border-white/20 bg-white/10 text-white placeholder:text-white/40"
                />
              </Field>
              <Field label="電話番号" id="r-phone" required>
                <Input
                  id="r-phone"
                  type="tel"
                  required
                  placeholder="090-1234-5678"
                  className="rounded-lg border-white/20 bg-white/10 text-white placeholder:text-white/40"
                />
              </Field>
            </div>
            <Field label="メールアドレス" id="r-email" required>
              <Input
                id="r-email"
                type="email"
                required
                placeholder="example@email.com"
                className="rounded-lg border-white/20 bg-white/10 text-white placeholder:text-white/40"
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="日付" id="r-date" required>
                <Input
                  id="r-date"
                  type="date"
                  required
                  className="rounded-lg border-white/20 bg-white/10 text-white"
                />
              </Field>
              <Field label="時間" id="r-time" required>
                <Input
                  id="r-time"
                  type="time"
                  required
                  className="rounded-lg border-white/20 bg-white/10 text-white"
                />
              </Field>
              <Field label="人数" id="r-guests" required>
                <select
                  id="r-guests"
                  required
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n} className="text-[#3D2B1F]">
                      {n}名
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="ご要望（任意）" id="r-note">
              <Textarea
                id="r-note"
                rows={3}
                placeholder="アレルギー、席の希望など"
                className="rounded-lg border-white/20 bg-white/10 text-white placeholder:text-white/40"
              />
            </Field>
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full bg-[#8B6914] hover:bg-[#7A5F12]"
            >
              <Calendar className="size-4" />
              予約リクエストを送信
            </Button>
            <p className="text-center text-xs text-white/50">
              ※ ポートフォリオ用デモ。実際には送信されません。
            </p>
          </form>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 sm:py-28">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <SectionTitle en="CONTACT" ja="お問い合わせ" />
          <form
            onSubmit={handleContact}
            className="mt-10 space-y-5 rounded-xl border border-[#E8DDD0] bg-white p-8"
          >
            <Field label="お名前" id="c-name" required dark>
              <Input id="c-name" required placeholder="山田 花子" className="rounded-lg" />
            </Field>
            <Field label="メールアドレス" id="c-email" required dark>
              <Input
                id="c-email"
                type="email"
                required
                placeholder="example@email.com"
                className="rounded-lg"
              />
            </Field>
            <Field label="お問い合わせ内容" id="c-msg" required dark>
              <Textarea
                id="c-msg"
                required
                rows={5}
                placeholder="貸切のご相談、メニューについてなど"
                className="rounded-lg"
              />
            </Field>
            <Button
              type="submit"
              className="w-full rounded-full bg-[#8B6914] hover:bg-[#7A5F12]"
            >
              <Mail className="size-4" />
              送信する（デモ）
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8DDD0] py-10 text-center">
        <p className="font-[family-name:var(--font-cafe-serif)] text-lg text-[#8B6914]">
          {cafeInfo.name}
        </p>
        <p className="mt-2 text-xs text-[#999]">
          ※ このサイトは Web制作ポートフォリオ用のデモです
        </p>
        <p className="mt-1 text-xs text-[#999]">
          © 2026 珈琲屋 木漏れ日 Portfolio by nabe-max
        </p>
      </footer>
    </div>
  );
}

function SectionTitle({
  en,
  ja,
  light = false,
}: {
  en: string;
  ja: string;
  light?: boolean;
}) {
  return (
    <div className="text-center">
      <p className="text-xs tracking-[0.4em] text-[#8B6914]">{en}</p>
      <h2
        className={cn(
          "mt-2 font-[family-name:var(--font-cafe-serif)] text-3xl font-semibold",
          light ? "text-white" : "text-[#3D2B1F]",
        )}
      >
        {ja}
      </h2>
    </div>
  );
}

function Field({
  label,
  id,
  required,
  dark,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className={cn("text-xs font-medium", dark ? "text-[#666]" : "text-white/80")}
      >
        {label}
        {required && <span className="text-[#E8D5A3]"> *</span>}
      </label>
      {children}
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-4">
      <Icon className="mt-0.5 size-5 shrink-0 text-[#8B6914]" />
      <div>
        <dt className="text-xs text-[#999]">{label}</dt>
        <dd className="mt-1 font-medium">{value}</dd>
      </div>
    </div>
  );
}
