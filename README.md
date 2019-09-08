# Nitori-/rust-actions

## `get-rust` Usage

This action works on all OSes

```yaml
on: push
name: CI Tests
jobs:
  ci:
    name: CI Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: Nitori-/rust-actions/get-rust@master
        with:
          version: stable               # Optional, default is stable
          make_default: true            # Optional, default is true
          components: "rustfmt clippy"  # Optional, default is "rustfmt clippy"
      - run: "cargo fmt -- --check"
      - run: "cargo clippy -- --Dwarnings"
      - run: "cargo test"
```
