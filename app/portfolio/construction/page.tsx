"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  Hammer,
  Landmark,
  Mail,
  MapPin,
  Menu,
  Phone,
  Shield,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  about,
  companyInfo,
  news,
  recruitment,
  services,
  works,
} from "@/data/construction-content";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#about", label: "会社概要" },
  { href: "#service", label: "サービス" },
  { href: "#works", label: "施工実績" },
  { href: "#news", label: "お知らせ" },
  { href: "#recruit", label: "採用情報" },
  { href: "#contact", label: "お問い合わせ" },
];

const serviceIcons = {
  building: Building2,
  hammer: Hammer,
  landmark: Landmark,
  shield: Shield,
} as const;

const workImages = [
  "photo-1541888946425-d81bb19240f5",
  "photo-1600585154340-be6161a56a0c",
  "photo-1600607687939-ce8a6c25118c",
  "photo-1503387762-592deb58ef4e",
];

export default function ConstructionPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-white text-[#1A1A1A]">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 bg-[#1E3A5F] text-white shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="#top" className="flex flex-col">
            <span className="font-[family-name:var(--font-corp-display)] text-xl font-bold tracking-wider">
              {companyInfo.name}
            </span>
            <span className="text-[10px] tracking-[0.2em] text-white/60">
              {companyInfo.nameEn}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-white/80 transition-colors hover:text-[#E87722]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href={`tel:${companyInfo.phone}`}
              className="flex items-center gap-2 text-sm"
            >
              <Phone className="size-4 text-[#E87722]" />
              {companyInfo.phone}
            </a>
            <Button
              asChild
              className="rounded-sm bg-[#E87722] hover:bg-[#D06818]"
            >
              <a href="#contact">お問い合わせ</a>
            </Button>
          </div>

          <button
            type="button"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="メニュー"
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="border-t border-white/10 bg-[#1E3A5F] px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-2">
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
              <Button asChild className="mt-2 bg-[#E87722]">
                <a href="#contact" onClick={() => setMobileOpen(false)}>
                  お問い合わせ
                </a>
              </Button>
            </div>
          </nav>
        )}
      </header>

      {/* Hero */}
      <section id="top" className="relative min-h-[85vh] pt-16">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
            alt="建設現場"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#1E3A5F]/75" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(85vh-4rem)] max-w-6xl flex-col justify-center px-4 sm:px-6">
          <p className="text-sm font-medium tracking-[0.3em] text-[#E87722]">
            CONSTRUCTION & REFORM
          </p>
          <h1 className="mt-4 max-w-2xl font-[family-name:var(--font-corp-display)] text-4xl font-bold leading-tight tracking-wide text-white sm:text-6xl">
            {companyInfo.tagline}
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
            新築・リフォーム・公共施設まで。
            <br />
            愛知を中心に、確かな技術でお客様の理想を形にします。
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-sm bg-[#E87722] px-8 hover:bg-[#D06818]"
            >
              <a href="#contact">
                無料見積もり
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-sm border-white/50 bg-transparent px-8 text-white hover:bg-white/10"
            >
              <a href="#works">施工実績を見る</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[#E87722] py-6 text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6">
          {[
            { label: "創業", value: "1998年" },
            { label: "施工実績", value: "850件+" },
            { label: "従業員", value: "48名" },
            { label: "対応エリア", value: "愛知県全域" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-[family-name:var(--font-corp-display)] text-2xl font-bold sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader en="ABOUT" ja={about.title} />
          <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h3 className="text-2xl font-bold leading-snug text-[#1E3A5F] sm:text-3xl">
                {about.heading}
              </h3>
              <p className="mt-6 text-sm leading-[2] text-[#666] sm:text-base">
                {about.body}
              </p>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {about.values.map((v) => (
                  <div
                    key={v.label}
                    className="border-l-4 border-[#E87722] bg-[#F5F7FA] p-4"
                  >
                    <p className="font-bold text-[#1E3A5F]">{v.label}</p>
                    <p className="mt-1 text-xs text-[#666]">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1581094794359-8448b3149984?w=800&q=80"
                  alt="会社外観"
                  fill
                  className="object-cover"
                />
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["会社名", companyInfo.name],
                  ["設立", companyInfo.established],
                  ["資本金", companyInfo.capital],
                  ["従業員数", companyInfo.employees],
                  ["所在地", companyInfo.address],
                  ["TEL", companyInfo.phone],
                ].map(([dt, dd]) => (
                  <div key={dt} className="border border-[#E5E7EB] p-3">
                    <dt className="text-xs text-[#999]">{dt}</dt>
                    <dd className="mt-1 font-medium">{dd}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="service" className="bg-[#F5F7FA] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader en="SERVICE" ja="サービス" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {services.map((service) => {
              const Icon =
                serviceIcons[service.icon as keyof typeof serviceIcons];
              return (
                <article
                  key={service.title}
                  className="group flex gap-6 border border-[#E5E7EB] bg-white p-8 transition-shadow hover:shadow-lg"
                >
                  <div className="flex size-14 shrink-0 items-center justify-center bg-[#1E3A5F] text-[#E87722]">
                    <Icon className="size-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1E3A5F]">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#666]">
                      {service.desc}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Works */}
      <section id="works" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader en="WORKS" ja="施工実績" />
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {works.map((work, index) => (
              <article
                key={work.title}
                className="group overflow-hidden border border-[#E5E7EB]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={`https://images.unsplash.com/${workImages[index]}?w=800&q=80`}
                    alt={work.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 bg-[#E87722] px-3 py-1 text-xs font-medium text-white">
                    {work.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-[#999]">
                    <span>{work.year}</span>
                    <span>{work.area}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-[#1E3A5F]">
                    {work.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#666]">
                    {work.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section id="news" className="bg-[#1E3A5F] py-20 text-white sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader en="NEWS" ja="お知らせ" light />
          <ul className="mt-12 divide-y divide-white/10">
            {news.map((item) => (
              <li key={item.title}>
                <a
                  href="#"
                  className="group flex flex-col gap-2 py-5 transition-colors hover:text-[#E87722] sm:flex-row sm:items-center sm:gap-6"
                >
                  <time className="shrink-0 text-sm text-white/60">
                    {item.date}
                  </time>
                  <span className="shrink-0 rounded-sm bg-[#E87722] px-2 py-0.5 text-xs">
                    {item.category}
                  </span>
                  <span className="flex-1 text-sm group-hover:underline">
                    {item.title}
                  </span>
                  <ChevronRight className="hidden size-4 shrink-0 sm:block" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Recruit */}
      <section id="recruit" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader en="RECRUIT" ja="採用情報" />
          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold text-[#1E3A5F]">
                {recruitment.heading}
              </h3>
              <p className="mt-6 text-sm leading-[2] text-[#666]">
                {recruitment.body}
              </p>
              <div className="mt-8 flex items-center gap-3 text-[#1E3A5F]">
                <Users className="size-6 text-[#E87722]" />
                <span className="text-sm font-medium">
                  未経験者歓迎・資格取得支援あり
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {recruitment.positions.map((pos) => (
                <div
                  key={pos.title}
                  className="flex items-center justify-between border border-[#E5E7EB] bg-[#F5F7FA] p-5"
                >
                  <div>
                    <p className="font-bold text-[#1E3A5F]">{pos.title}</p>
                    <p className="mt-1 text-xs text-[#999]">{pos.type}</p>
                  </div>
                  <p className="text-sm font-medium text-[#E87722]">
                    {pos.salary}
                  </p>
                </div>
              ))}
              <Button
                asChild
                className="mt-4 w-full rounded-sm bg-[#1E3A5F] hover:bg-[#2A4A6F]"
              >
                <a href="#contact">
                  採用に関するお問い合わせ
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-[#F5F7FA] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader en="CONTACT" ja="お問い合わせ" />
          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <p className="text-sm leading-relaxed text-[#666]">
                新築・リフォーム・公共工事のご相談、お見積もりは無料です。
                お気軽にお問い合わせください。
              </p>
              <div className="space-y-4 border border-[#E5E7EB] bg-white p-6">
                <InfoRow icon={Phone} label="TEL" value={companyInfo.phone} />
                <InfoRow icon={Mail} label="Email" value={companyInfo.email} />
                <InfoRow
                  icon={MapPin}
                  label="所在地"
                  value={companyInfo.address}
                />
              </div>
            </div>
            <form
              className="space-y-5 border border-[#E5E7EB] bg-white p-8"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="space-y-2">
                <label htmlFor="c-name" className="text-xs font-medium">
                  お名前 <span className="text-[#E87722]">*</span>
                </label>
                <Input id="c-name" placeholder="山田 太郎" className="rounded-sm" />
              </div>
              <div className="space-y-2">
                <label htmlFor="c-email" className="text-xs font-medium">
                  メールアドレス <span className="text-[#E87722]">*</span>
                </label>
                <Input
                  id="c-email"
                  type="email"
                  placeholder="example@email.com"
                  className="rounded-sm"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="c-type" className="text-xs font-medium">
                  お問い合わせ種別
                </label>
                <select
                  id="c-type"
                  className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm"
                >
                  <option>新築工事</option>
                  <option>リフォーム・改修</option>
                  <option>公共・商業施設</option>
                  <option>採用について</option>
                  <option>その他</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="c-msg" className="text-xs font-medium">
                  お問い合わせ内容 <span className="text-[#E87722]">*</span>
                </label>
                <Textarea
                  id="c-msg"
                  rows={5}
                  placeholder="ご相談内容をお書きください"
                  className="rounded-sm"
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-sm bg-[#E87722] hover:bg-[#D06818]"
              >
                <Mail className="size-4" />
                送信する（デモ）
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E3A5F] py-12 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div>
              <p className="font-[family-name:var(--font-corp-display)] text-xl font-bold tracking-wider">
                {companyInfo.name}
              </p>
              <p className="mt-2 text-xs text-white/60">{companyInfo.address}</p>
            </div>
            <nav className="flex flex-wrap justify-center gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-xs text-white/60 hover:text-[#E87722]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <p className="mt-8 border-t border-white/10 pt-8 text-center text-xs text-white/40">
            ※ このサイトは Web制作ポートフォリオ用のデモです | © 2026
            株式会社匠建 Portfolio by nabe-max
          </p>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({
  en,
  ja,
  light = false,
}: {
  en: string;
  ja: string;
  light?: boolean;
}) {
  return (
    <div>
      <p
        className={cn(
          "font-[family-name:var(--font-corp-display)] text-sm font-bold tracking-[0.3em]",
          light ? "text-[#E87722]" : "text-[#E87722]",
        )}
      >
        {en}
      </p>
      <h2
        className={cn(
          "mt-2 text-2xl font-bold sm:text-3xl",
          light ? "text-white" : "text-[#1E3A5F]",
        )}
      >
        {ja}
      </h2>
    </div>
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
      <Icon className="mt-0.5 size-5 shrink-0 text-[#E87722]" />
      <div>
        <p className="text-xs text-[#999]">{label}</p>
        <p className="mt-1 text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
