# FabCheck Benchmark Constitution

## Purpose

This benchmark library defines the fabrication estimating standards that FabCheck should emulate.

These benchmarks are the authoritative source of truth for how fabrication scope should be interpreted, categorized, and priced.

FabCheck is not intended to generate formal quotations or exact construction estimates.

Its purpose is to provide realistic early-stage fabrication budget ranges that help event producers, agencies, and marketers begin conversations with fabrication partners.

Budget accuracy should prioritize realistic ballpark ranges over false precision.

---

# Source of Truth

If the benchmark library and existing application logic disagree, the benchmark library should be considered authoritative.

Update prompts, pricing logic, structured analysis, fabrication knowledge, and deterministic calculations to align with the benchmark standards unless doing so would introduce a clear software defect.

Do not modify the benchmark interpretations to fit existing code.

Modify the estimator to match the benchmark library.

---

# Overall Estimating Philosophy

FabCheck estimates fabrication scope—not overall event cost.

Each estimate should be produced using the following sequence:

1. Project type establishes the estimating model.
2. Selected footprint establishes the baseline fabrication budget.
3. AI identifies visible fabricated assemblies.
4. Assemblies are converted into fabrication effort ratings.
5. Fabrication effort modifies the baseline range.
6. A deterministic pricing model generates the final fabrication budget range.

OpenAI should analyze fabrication scope.

It should not independently invent project pricing.

Pricing should always be generated from FabCheck's own logic.

---

# Primary Fabrication Categories

All fabrication analysis should use the following categories.

These categories should be used consistently throughout:

• AI structured analysis
• Benchmark JSON
• Pricing logic
• Review page
• Email output
• PDF output
• Regression testing

Categories:

- Walls
- Flooring
- Counters
- Millwork
- AV
- Structure
- Lighting
- Custom Fabrication

Client-facing labels may be simplified for readability:

- Scenic Walls
- Flooring
- Counters & Bars
- Millwork
- Technology
- Structure
- Lighting
- Custom Fabrication

---

# Fabrication Effort Ratings

Fabrication effort measures how much a category contributes to fabrication cost.

It represents:

- shop labor
- materials
- fabrication complexity
- engineering
- finishing
- assembly
- coordination

It does NOT represent:

- visual prominence
- physical size alone
- attractiveness
- amount of branding
- amount of graphics

Suggested interpretation:

0 = Not present

1–2 = Minor fabrication contribution

3–4 = Moderate fabrication contribution

5–6 = Significant fabrication driver

7–8 = Heavy fabrication driver

9–10 = Dominant fabrication scope

A small custom cabinet may legitimately receive a higher effort score than a very large flat scenic wall.

Always score fabrication effort rather than visual impact.

---

# Assembly-Based Interpretation

FabCheck should identify fabricated assemblies rather than counting every visible characteristic.

Correct:

Graphic scenic wall

Incorrect:

wall

vinyl

graphics

branding

logo

Likewise:

Wrapped reception counter

is one fabricated assembly.

Halo-lit dimensional logo

is one fabricated assembly.

Oversized product replica

is one fabricated assembly.

Do not separately count overlapping characteristics belonging to the same assembly.

---

# Graphics and Branding

Printed graphics are considered part of the finish of an assembly.

Examples:

Printed scenic wall

Printed reception counter

Printed floor graphic

Printed cabinet graphics

These should NOT be counted separately.

Only treat branding as an independent fabrication element when it is:

- dimensional
- illuminated
- suspended
- freestanding
- sculptural
- custom fabricated

Flat printed logos are part of the assembly finish.

Large dimensional logos belong under Custom Fabrication.

---

# Walls

Wall finishes generally fall into two groups:

- Painted
- Graphic

Do not require AI to distinguish between:

SEG fabric

or

Hard scenic with vinyl wrap.

When construction method cannot be determined from the rendering, classify simply as:

Graphic Wall

Budget ranges should comfortably account for either common construction method.

Large flat walls should not automatically receive high effort scores.

Complexity depends on:

- geometry
- quantity
- finish
- construction
- returns
- integration
- lighting
- fabrication difficulty

---

# Flooring

Flooring generally falls into:

- Standard carpet
- Standard roll flooring (wood grain, concrete, tile)
- Custom printed flooring

Standard flooring has relatively low pricing influence.

Printed custom flooring increases fabrication scope slightly.

---

# Counters

Counters include:

- Reception counters
- Demo counters
- Bars
- Information desks

Counters may be:

- Painted
- Wrapped

Counters often require substantial fabrication effort.

Well-built counters frequently represent more fabrication labor than a large flat scenic wall.

Do not underestimate counter complexity.

---

# Millwork

Millwork includes:

- Shelving
- Cabinetry
- Doors
- Product displays
- Built-in storage
- Retail fixtures
- Display cabinetry

Flat scenic walls are not millwork.

---

# AV

AV includes visible:

- TVs
- Touchscreens
- Interactive kiosks
- Touch tables
- Speakers

Standard AV equipment is excluded from fabrication pricing.

FabCheck should recognize AV because scenic integration affects fabrication.

Do not include standard AV equipment cost in fabrication budgets.

---

# Structure

Structure includes:

- Truss
- Portals
- Arches
- Canopies
- Overhead framing
- Hanging sign structures
- Large architectural framing systems

Structure is generally a major pricing driver.

---

# Lighting

Lighting includes:

- Museum lights
- Gooseneck fixtures
- Uplights
- Shelf lighting
- Counter lighting
- Edge glow
- Internal illumination
- Halo-lit logos

Do not count ambient convention-center lighting.

Only score integrated fabricated lighting systems.

---

# Custom Fabrication

Custom Fabrication includes:

- Sculptural scenic
- Oversized props
- Product replicas
- Organic geometry
- Curved construction
- Specialty acrylic
- CNC-carved scenic
- Dimensional logos
- Hero scenic elements
- Custom photo opportunities

Custom Fabrication is one of the strongest fabrication cost drivers.

---

# Project Types

Use the same fabrication language across all project types.

Trade show booths

Photo moments

Brand activations

Mobile bars

Pop-up displays

Interpretation changes.

Vocabulary should remain consistent.

Photo moments generally emphasize:

Walls

Lighting

Structure

Custom Fabrication

rather than counters or millwork.

---

# Budget Scope

FabCheck estimates INCLUDE:

Fabrication materials

Shop labor

Standard fabrication finishing

FabCheck estimates EXCLUDE:

Freight

Shipping

Installation

Dismantle

Drayage

Rigging labor

Venue labor

Venue electrical

Furniture rental

AV rental

Taxes

Permits

Venue services

General contractor costs

Do not include staffing as a pricing assumption.

---

# Pricing Philosophy

FabCheck should produce realistic planning ranges.

It should distinguish between:

Simple scenic

Premium scenic

Heavy millwork

Integrated lighting

Structural framing

Custom fabrication

Budgets should intentionally allow several thousand dollars of range.

Avoid giving the appearance of exact quotations.

When visible construction is ambiguous, allow the budget range to cover the most probable fabrication methods.

Slightly conservative pricing is preferred over underestimating fabrication cost.

---

# Benchmark Interpretation

Each annotated benchmark image represents:

Visible fabricated assemblies

Fabrication effort profile

Target budget

Pricing assumptions

Exclusions

These benchmark sheets should be treated as the human-readable estimating standard.

Generate structured benchmark JSON directly from these benchmark sheets.

Do not manually reinterpret benchmark intent.

---

# Benchmark JSON

Generate structured JSON for every benchmark containing at minimum:

Benchmark ID

Project Type

Footprint

Budget Low

Budget High

Fabrication Effort Profile

Detected Assemblies

Pricing Assumptions

Exclusions

Cumulative Version Reference (when applicable)

The annotated benchmark image remains the human source of truth.

---

# Benchmark Validation

Create an automated benchmark testing framework.

Each benchmark should compare:

Expected effort profile

Generated effort profile

Expected budget

Calculated budget

Generated estimates should generally overlap the benchmark target range.

Maintain logical progression across cumulative benchmark versions.

Later benchmark versions should not estimate lower than earlier versions without valid fabrication reasoning.

---

# Review Page

Add a client-facing Fabrication Effort Profile to the review page.

Display horizontal effort bars for:

Scenic Walls

Flooring

Counters & Bars

Millwork

Technology

Structure

Lighting

Custom Fabrication

Bars represent relative fabrication effort only.

Do not expose internal pricing formulas.

Below the bars display:

Primary Cost Drivers

Automatically summarize the two to four highest-rated fabrication categories.

The purpose is to explain why the estimate falls within its budget range and build confidence in the estimate.

---

# Implementation Objectives

Using this benchmark library:

Generate structured benchmark JSON.

Refactor OpenAI prompts.

Refactor fabrication knowledge.

Improve fabrication detection.

Prevent double counting.

Calibrate fabrication effort ratings.

Calibrate deterministic pricing.

Implement benchmark regression testing.

Implement the client-facing Fabrication Effort Profile.

Preserve existing application functionality wherever possible.

The completed estimating system should reflect the benchmark standards contained in this library rather than relying on generic trade show assumptions.