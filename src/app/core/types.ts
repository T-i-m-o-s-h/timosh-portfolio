export interface Experience {
  readonly role: string;
  readonly company: string;
  readonly location: string;
  readonly period: string;
  readonly start: string;
  readonly current?: boolean;
  readonly highlights: readonly string[];
  readonly stack: readonly string[];
}

export interface Project {
  readonly name: string;
  readonly kind: string;
  readonly blurb: string;
  readonly stack: readonly string[];
  readonly accent: string;
}

export interface SkillGroup {
  readonly label: string;
  readonly hint: string;
  readonly items: readonly string[];
}

export interface Stat {
  readonly value: number;
  readonly suffix: string;
  readonly label: string;
}

export interface NavLink {
  readonly id: string;
  readonly label: string;
  readonly index: string;
}
