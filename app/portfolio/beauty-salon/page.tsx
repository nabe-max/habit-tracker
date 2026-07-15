"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Mail,
  MapPin,
  Menu,
  Phone,
  Scissors,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  concept,
  menuItems,
  salonInfo,
  staff,
  testimonials,
} from "@/data/salon-content";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#concept", label: "Concept" },
  { href: "#menu", label: "Menu" },
  { href: "#staff", label: "Staff" },
  { href: "#voice", label: "Voice" },
  { href: "#access", label: "Access" },
  { href: "#contact", label: "Contact" },
];

export default function BeautySalonPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-[#FAF7F2] text-[#2C2C2C]">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#E8E0D5]/80 bg-[#FAF7F2]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="#top"
            className="font-[family-name:var(--font-salon-serif)] text-xl tracking-[0.2em] text-[#2C2C2C]"
          >
            {salonInfo.name}
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs tracking-[0.15em] text-[#666] transition-colors hover:text-[#C4A574]"
              >
                {link.label}
              </a>
            ))}
            <Button
              asChild
              className="rounded-none bg-[#2C2C2C] px-6 text-xs tracking-widest text-[#FAF7F2] hover:bg-[#444]"
            >
              <a href="#reservation">RESERVE</a>
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
          <nav className="border-t border-[#E8E0D5] bg-[#FAF7F2] px-4 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm tracking-widest"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button
                asChild
                className="rounded-none bg-[#2C2C2C] tracking-widest"
              >
                <a href="#reservation" onClick={() => setMobileOpen(false)}>
                  RESERVE
                </a>
              </Button>
            </div>
          </nav>
        )}
      </header>

      {/* Hero */}
      <section id="top" className="relative min-h-screen">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80"
            alt="美容室の店内"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#2C2C2C]/45" />
        </div>

        <div className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center text-white">
          <p className="mb-4 text-xs tracking-[0.4em] text-[#E8D5B5]">
            BEAUTY SALON
          </p>
          <h1 className="font-[family-name:var(--font-salon-serif)] text-5xl tracking-[0.15em] sm:text-7xl">
            {salonInfo.name}
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed tracking-wide text-white/90 sm:text-base">
            {salonInfo.tagline}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-none bg-[#C4A574] px-10 tracking-widest text-white hover:bg-[#B39464]"
            >
              <a href="#reservation">
                <Calendar className="size-4" />
                予約する
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-none border-white/60 bg-transparent px-10 tracking-widest text-white hover:bg-white/10"
            >
              <a href="#menu">メニューを見る</a>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-10 w-px bg-white/50" />
        </div>
      </section>

      {/* Concept */}
      <section id="concept" className="py-24 sm:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
              alt="スタイリングの様子"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <SectionLabel>{concept.title}</SectionLabel>
            <h2 className="mt-4 font-[family-name:var(--font-salon-serif)] text-3xl leading-snug sm:text-4xl">
              {concept.heading}
            </h2>
            <p className="mt-8 whitespace-pre-line text-sm leading-[2] text-[#666] sm:text-base">
              {concept.body}
            </p>
            <div className="mt-10 flex items-center gap-3 text-[#C4A574]">
              <Scissors className="size-5" />
              <span className="text-xs tracking-[0.2em]">
                PERSONAL BEAUTY DESIGN
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="bg-[#2C2C2C] py-24 text-[#FAF7F2] sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <SectionLabel light>MENU & PRICE</SectionLabel>
            <h2 className="mt-4 font-[family-name:var(--font-salon-serif)] text-3xl sm:text-4xl">
              メニュー・料金
            </h2>
            <p className="mt-4 text-sm text-[#FAF7F2]/60">
              表示価格は税込です。髪の長さ・状態により変動する場合があります。
            </p>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {menuItems.map((group) => (
              <div key={group.category}>
                <h3 className="border-b border-[#C4A574]/40 pb-3 text-xs tracking-[0.3em] text-[#C4A574]">
                  {group.category}
                </h3>
                <ul className="mt-6 space-y-5">
                  {group.items.map((item) => (
                    <li key={item.name} className="flex justify-between gap-4">
                      <div>
                        <p className="text-sm">{item.name}</p>
                        {item.note && (
                          <p className="mt-1 text-xs text-[#FAF7F2]/50">
                            {item.note}
                          </p>
                        )}
                      </div>
                      <p className="shrink-0 font-[family-name:var(--font-salon-serif)] text-lg text-[#C4A574]">
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

      {/* Staff */}
      <section id="staff" className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <SectionLabel>STAFF</SectionLabel>
            <h2 className="mt-4 font-[family-name:var(--font-salon-serif)] text-3xl sm:text-4xl">
              スタッフ紹介
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {staff.map((member, index) => (
              <article
                key={member.name}
                className="group overflow-hidden border border-[#E8E0D5] bg-white transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#E8E0D5]">
                  <Image
                    src={`https://images.unsplash.com/photo-${
                      index === 0
                        ? "1494790108377-be9c29b29330"
                        : index === 1
                          ? "1507003211169-0b1dd7228f2d"
                          : "1438761681033-6461ffad8d80"
                    }?w=600&q=80`}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs tracking-[0.2em] text-[#C4A574]">
                    {member.role}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-salon-serif)] text-xl">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#999]">
                    得意：{member.specialty}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-[#666]">
                    {member.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Voice */}
      <section id="voice" className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <SectionLabel>VOICE</SectionLabel>
            <h2 className="mt-4 font-[family-name:var(--font-salon-serif)] text-3xl sm:text-4xl">
              お客様の声
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote
                key={item.name}
                className="border border-[#E8E0D5] bg-[#FAF7F2] p-8"
              >
                <div className="flex gap-1 text-[#C4A574]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="mt-6 text-sm leading-[1.9] text-[#666]">
                  「{item.text}」
                </p>
                <footer className="mt-6 border-t border-[#E8E0D5] pt-4">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-[#999]">{item.age}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Access */}
      <section id="access" className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <SectionLabel>ACCESS</SectionLabel>
            <h2 className="mt-4 font-[family-name:var(--font-salon-serif)] text-3xl sm:text-4xl">
              アクセス
            </h2>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <div className="relative aspect-video overflow-hidden bg-[#E8E0D5] lg:aspect-auto lg:min-h-[360px]">
              <div className="absolute inset-0 flex items-center justify-center bg-[#E8E0D5]">
                <div className="text-center text-[#999]">
                  <MapPin className="mx-auto size-10" />
                  <p className="mt-3 text-sm">Google Map（デモ）</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-6 border border-[#E8E0D5] bg-white p-8 sm:p-10">
              <InfoRow icon={MapPin} label="住所" value={salonInfo.address} />
              <InfoRow icon={Phone} label="電話" value={salonInfo.phone} />
              <InfoRow icon={Clock} label="営業時間" value={salonInfo.hours} />
              <p className="text-sm leading-relaxed text-[#666]">
                渋谷駅より徒歩5分。1Fがカフェの白いビルの2Fです。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation & Contact */}
      <section id="reservation" className="bg-[#2C2C2C] py-24 text-[#FAF7F2] sm:py-32">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Sparkles className="mx-auto size-8 text-[#C4A574]" />
          <h2 className="mt-6 font-[family-name:var(--font-salon-serif)] text-3xl sm:text-4xl">
            ご予約
          </h2>
          <p className="mt-4 text-sm text-[#FAF7F2]/70">
            24時間オンライン予約を受け付けています。
            <br />
            当日予約もお電話にてお問い合わせください。
          </p>
          <Button
            asChild
            size="lg"
            className="mt-10 rounded-none bg-[#C4A574] px-12 tracking-widest hover:bg-[#B39464]"
          >
            <a href="#contact">
              <Calendar className="size-4" />
              オンライン予約（デモ）
            </a>
          </Button>
          <p className="mt-6 text-lg tracking-wider">{salonInfo.phone}</p>
        </div>
      </section>

      <section id="contact" className="py-24 sm:py-32">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <div className="text-center">
            <SectionLabel>CONTACT</SectionLabel>
            <h2 className="mt-4 font-[family-name:var(--font-salon-serif)] text-3xl">
              お問い合わせ
            </h2>
          </div>

          <form
            className="mt-12 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs tracking-widest">
                お名前
              </label>
              <Input
                id="name"
                placeholder="山田 花子"
                className="rounded-none border-[#E8E0D5] bg-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs tracking-widest">
                メールアドレス
              </label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                className="rounded-none border-[#E8E0D5] bg-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-xs tracking-widest">
                お問い合わせ内容
              </label>
              <Textarea
                id="message"
                rows={5}
                placeholder="ご質問・ご要望をお書きください"
                className="rounded-none border-[#E8E0D5] bg-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-none bg-[#2C2C2C] tracking-widest hover:bg-[#444]"
            >
              <Mail className="size-4" />
              送信する（デモ）
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8E0D5] py-12 text-center">
        <p className="font-[family-name:var(--font-salon-serif)] text-lg tracking-[0.2em]">
          {salonInfo.name}
        </p>
        <p className="mt-4 text-xs text-[#999]">
          ※ このサイトは Web制作ポートフォリオ用のデモです
        </p>
        <p className="mt-2 text-xs text-[#999]">
          © 2026 LUXE hair studio. Portfolio by nabe-max
        </p>
      </footer>
    </div>
  );
}

function SectionLabel({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p
      className={cn(
        "text-xs tracking-[0.4em]",
        light ? "text-[#C4A574]" : "text-[#C4A574]",
      )}
    >
      {children}
    </p>
  );
}

function InfoRow({
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
      <Icon className="mt-0.5 size-5 shrink-0 text-[#C4A574]" />
      <div>
        <p className="text-xs tracking-widest text-[#999]">{label}</p>
        <p className="mt-1 text-sm">{value}</p>
      </div>
    </div>
  );
}
