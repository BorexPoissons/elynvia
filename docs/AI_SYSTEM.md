# ELYNVIA — AI System v0.1

## Principle

ELYNVIA is not tied to one model vendor.

The AI system should expose product capabilities through provider-independent interfaces and use adapters for individual model providers.

## First AI capability: Intent extraction

Input:

- current user message;
- relevant conversation context;
- permitted user preferences/memory;
- locale/timezone/currency context when appropriate.

Output:

- validated structured Intent;
- confidence/uncertainty signals where useful;
- missing information;
- proposed follow-up question when required.

## Reliability rules

- Structured model output must be schema-validated server-side.
- Invalid model output must fail safely rather than silently corrupting data.
- Critical facts should not be invented to make an Intent look complete.
- Store only the model metadata needed for debugging, cost, quality and traceability; avoid unnecessary sensitive prompt logging.
- Prompts and schemas should be versioned.

## Provider routing

Future routing may consider:

- task quality;
- latency;
- price;
- context length;
- tool capability;
- availability;
- privacy/data-processing requirements.

Do not implement sophisticated routing until more than one provider or a real need exists.

## Memory boundary

Conversation context and durable memory are different. A model seeing information during a conversation does not automatically authorize permanent storage as memory.

## Tool/action boundary

As ELYNVIA gains tools, distinguish:

1. read/research operations;
2. reversible low-risk actions;
3. consequential actions requiring explicit user approval.

Autonomy must be permissioned and observable.
