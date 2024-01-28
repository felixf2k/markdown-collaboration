import type { FieldSchema, RelationshipSchema, Schema } from '$lib/schemas';
import z from 'zod';

export function zodValidatorFromSchema(config: Schema) {
    let shape: z.ZodRawShape = {};
    for (const field of config.fields) {
        shape[field.id] = zodFromField(field);
    }
    for (const relationship of config.relationships) {
        shape[relationship.id] = zodFromRelationShip(relationship);
    }
    return z.object(shape);
}

function zodFromField(field: FieldSchema) {
    if (field.type.type == 'string') {
        let validator: z.ZodString | z.ZodArray<z.ZodString> = z.string();
        if (field.array) validator = validator.array();
        if (field.required) {
            validator.min(0);
        } else {
            validator.optional();
        }
        return validator;
    } else if (field.type.type == 'number') {
        let validator: z.ZodNumber | z.ZodArray<z.ZodNumber> = z.number();
        if (!field.required) validator.optional();
        if (field.type.min) validator.min(field.type.min);
        if (field.type.max) validator.max(field.type.max);
        if (field.array) validator = validator.array();
        return validator;
    } else if (field.type.type == 'enum') {
        const optionIds = field.type.values.map((v) => v.id);
        let validator:
            | z.ZodEffects<z.ZodString, string, string>
            | z.ZodArray<z.ZodEffects<z.ZodString, string, string>> = z
            .string()
            .refine(
                (s) => optionIds.includes(s),
                `value is not one of ${optionIds}`,
            );
        if (field.array) validator = validator.array();
        return validator;
    } else {
        throw new Error('Invalid Field Configuration');
    }
}

function zodFromRelationShip(relationship: RelationshipSchema) {
    let validator: z.ZodString | z.ZodArray<z.ZodString> = z.string().uuid();
    if (
        relationship.multiplicity === '0..1' ||
        relationship.multiplicity === '0..N' ||
        relationship.multiplicity === '1..N'
    ) {
        validator = validator.array();
    }
    // if (relationship.multiplicity === '1..N') validator.min(0);
    return validator;
}
