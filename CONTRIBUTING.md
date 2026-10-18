# Contributing to Earth Last Exam

We are building research tasks that test frontier agents in Earth science. We welcome researchers, scientific advisors, reviewers and environment engineers.

## Start with a question

Use the website form or open a task-proposal issue. Write a few sentences about a question or research difficulty. That is the only required part. A paper, dataset or workflow link is useful if you have one. We can discuss materials, environments and scientific acceptance criteria together.

For unpublished work, start with an outline that can be discussed publicly. Agree on access before sharing the complete research materials. Large data, private reference results and restricted software do not belong in a public issue or website pull request.

## Build the task together

After discussing the proposal, researchers and engineering collaborators prepare:

1. **An instruction:** scientific objective, starting materials, available resources and explicit output requirements.
2. **The environment:** domain software, pinned dependencies, local documentation, model configuration and a runnable baseline.
3. **The data:** versioned sources, checksums, units, coordinate systems, timestamps, availability rules and access conditions.
4. **A reference experiment:** executable entry point, expected artifacts and evidence that the specified task is achievable.
5. **The verifier:** independent observations, held-out conditions, physical checks, numerical tolerances and a task-specific rubric.

Each Earth Last Exam task is organized as a reproducible research workspace:

```text
task-name/
├── instruction.md
├── task.toml
├── environment/
│   └── Dockerfile
├── solution/
│   └── solve.sh
└── tests/
    └── test.sh
```

Data manifests and setup scripts accompany the environment. The reference solution and hidden evaluation material are isolated from the agent workspace. The verifier writes a machine-readable score and a detailed report of the scientific checks.

## Review and acceptance

Domain reviewers examine the importance of the question, assumptions, scientific realism and evidence required for success. Technical reviewers check the environment, inputs, reproducibility and verifier. A final review checks that the task is sufficiently demanding and that different scientifically valid approaches can pass.

Each critical scientific gate must pass. Strict success also requires at least 90/100 on the rubric and at least 80% in every dimension. Authors define the dimensions, weights, numerical tolerances and point mappings to fit the research question. Example weights are not a universal scientific rubric.

The original [typhoon specification](src/typhoon.html) illustrates the expected detail. It is an authored specification; the website repository is separate from executable task releases.

## Submit a complete Harbor package

Follow the [complete-task guidance](src/contribute.html#complete-task) and the
[task file list](src/benchmark.html#task-files). This repository presents the website;
complete task implementations are maintained separately. The integration target is
Harbor 0.24.0 / schema 1.3 with a separate verifier.

Submit the package in a task-repository PR or share a repository/archive link through
the contribution form. Include the exact revision, input hashes, actual oracle/nop
results and scientific counterexamples. Large data may live in versioned external
storage with reproducible retrieval instructions. The website form remains a short
starting point; it does not require uploading the whole workspace.

## Advisors and engineering collaborators

Use the advisory / engineering issue template to describe your area and interests. Advisors help choose important problems, assess scientific standards and interpret evaluation results. Engineering collaborators help package domain software, organize data and implement verifiers.

We record task authorship, implementation, review and advisory contributions. Public attribution is agreed with each contributor according to their work.

## Website changes

Edit `src/`, then run `npm run build`, `npm run check` and `npm test`. Keep English and Chinese copy in sync. Check layouts and interactions in a browser when changing the interface. Pull requests receive automated checks; only the main branch deploys to Pages.
