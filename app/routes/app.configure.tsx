import { FormEvent, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import {
    Page,
    Layout,
    Text,
    Card,
    Button,
    BlockStack,
    Box,
    List,
    Link,
    InlineStack,
    LegacyCard,
    FormLayout,
    TextField,
    Form,
    Select,
    Checkbox,
    ButtonGroup,
    Badge,
    Icon,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { MinusCircleIcon, PlusCircleIcon } from "@shopify/polaris-icons";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await authenticate.admin(request);

    return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    return null;
};

export default function () {
    const nav = useNavigation();
    const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const submit = useSubmit();
    const [company, setCompany] = useState<string>('');
    const [companyNameErr, setCompanyNameErr] = useState<string>('');

    const [programme, setProgramme] = useState<string>('');
    const [programmeNameErr, setProgrammeNameErr] = useState<string>('');

    const [description, setDescription] = useState<string>('');

    const businessTypeOptions = useMemo(() => [{ label: 'ECommerce', value: 'ecom' }], []);
    const [businessType, setBusinessType] = useState<string>('');
    const [businessTypeErr, setBusinessTypeErr] = useState<string>('');

    const [pointsSystemName, setPointsSystemName] = useState<string>('');

    const [pointsSystemMultiplier, setpointsSystemMultiplier] = useState<string>('');
    const [pointsSystemMultiplierErr, setpointsSystemMultiplierErr] = useState<string>('');

    const [isTierChecked, setIsTierChecked] = useState<boolean>(false);

    const tierOptions = useMemo(() => [{ label: 'Minimum Spend', value: 'minspend' }], []);

    const [nonTierCondition, setNonTierCondition] = useState<string>('');
    const [nonTierFrequency, setNonTierFrequency] = useState<string>('');

    const [tierCriteria, setTierCriteria] = useState<{ condition: string, frequency: string, name: string }[]>([{ 'condition': '', 'frequency': '', 'name': '' }]);

    const handleCompanyChange = useCallback((newValue: string) => { setCompany(newValue) }, [])
    const handleProgrammeChange = useCallback((newValue: string) => { setProgramme(newValue) }, [])
    const handleBusinessTypeChange = useCallback((newValue: string) => { setBusinessType(newValue) }, [])
    const handleDescriptionChange = useCallback((newValue: string) => { setDescription(newValue) }, [])
    const handlePointsNameChange = useCallback((newValue: string) => { setPointsSystemName(newValue) }, [])
    const handleMultiplierChange = useCallback((newValue: string) => { setpointsSystemMultiplier(newValue) }, [])
    const handleTierChecked = useCallback((checked: boolean) => { setIsTierChecked(checked) }, [])
    const handleNonTierConditionChange = useCallback((newValue: string) => { setNonTierCondition(newValue) }, [])
    const handleNonTierFrequencyChange = useCallback((newValue: string) => { setNonTierFrequency(newValue) }, [])
    const handleTierAttributeChange = (newValue: string, index: number, attributeName: 'name' | 'condition' | 'frequency'): void => {
        let tierCopy = [...tierCriteria];
        tierCopy[index][attributeName] = newValue;
        setTierCriteria(tierCopy);
    }
    const removeTierItem = (index: number) => {
        let tierCopy = [...tierCriteria];
        tierCopy.splice(index, 1);
        setTierCriteria(tierCopy);
    }
    const addItemToTier = () => {
        let tierCopy = [...tierCriteria];
        tierCopy.push({ condition: '', frequency: '', name: '' });
        setTierCriteria(tierCopy);
    }

    return (
        <Page fullWidth title="Configure Store" primaryAction={{ content: 'FAQ' }}>
            <ui-title-bar title="PointSwipe - Programme Setup Wizard"></ui-title-bar>
            <Form onSubmit={(e: FormEvent<HTMLFormElement>) => { e.preventDefault(); }}>
                <BlockStack gap={'500'}>
                    <Layout>
                        <Layout.Section variant="oneThird">
                            <Text as="h3" variant="headingMd" fontWeight={"bold"}>Basic Information</Text>
                            <Text as="p" variant="bodySm">Information such has business type, name of the loyalty programme etc.</Text>
                        </Layout.Section>
                        <Layout.Section variant="oneHalf">
                            <Card>
                                <FormLayout>
                                    <TextField label={'Company Name'} name="company" autoComplete="off" value={company} onChange={handleCompanyChange} placeholder="Name of the organisation" requiredIndicator error={companyNameErr} />
                                    <TextField label={'Programme Name'} name="programme" autoComplete="off" value={programme} onChange={handleProgrammeChange} placeholder="Name of the Programme" requiredIndicator error={programmeNameErr} />
                                    <Select requiredIndicator label='Business Type' name="businesstype" error={businessTypeErr} placeholder="Choose your Business Type" options={businessTypeOptions} value={businessType} onChange={handleBusinessTypeChange} />
                                    <TextField label={'Description'} name="description" autoComplete="off" value={description} onChange={handleDescriptionChange} multiline={5} />
                                </FormLayout>
                            </Card>
                        </Layout.Section>
                        <Layout.Section variant="oneThird" />
                    </Layout>
                    <Layout>
                        <Layout.Section variant="oneThird">
                            <Text as="h3" variant="headingMd" fontWeight={"bold"}>Points System</Text>
                            <Text as="p" variant="bodySm">Provide Name to your points system. and set a multiplier value for your customers.</Text>
                        </Layout.Section>
                        <Layout.Section variant="oneHalf">
                            <Card>
                                <FormLayout>
                                    <TextField label={'Name'} name="pointssystemname" autoComplete="off" value={pointsSystemName} onChange={handlePointsNameChange} helpText={'Provide the Points system name or leave it empty for it to be auto generated.'} />
                                    <TextField label={'Multiplier'} type="number" name="pointssystemmultiplier" autoComplete="off" value={pointsSystemMultiplier} onChange={handleMultiplierChange} helpText='This will depict what a point is worth the regional currency.' requiredIndicator error={pointsSystemMultiplierErr} prefix='x' />
                                </FormLayout>
                            </Card>
                        </Layout.Section>
                        <Layout.Section variant="oneThird" />
                    </Layout>
                    <Layout>
                        <Layout.Section variant="oneThird">
                            <Text as="h3" variant="headingMd" fontWeight={"bold"}>Customer Eligibility</Text>
                            <Text as="p" variant="bodySm">Set criterias for the customers to be eligible for rewards and for them to climb up the points system.</Text>
                        </Layout.Section>
                        <Layout.Section variant="oneHalf">
                            <Card>
                                <FormLayout>
                                    <Checkbox label='Enable Tiers' checked={isTierChecked} onChange={handleTierChecked} name="tierenabled" />
                                    {isTierChecked ? (
                                        <FormLayout>
                                            {tierCriteria?.map((criteria, index: number) => <InlineStack blockAlign="end" align="space-evenly" key={'tiercriteria' + index} direction={'row'}>
                                                <TextField label='Tier Name' name={"tiername_" + index} requiredIndicator value={criteria.name} onChange={(newValue: string) => handleTierAttributeChange(newValue, index, 'name')} autoComplete="off" />
                                                <Select options={tierOptions} label='Condition' name={"tiercondition_" + index} requiredIndicator value={criteria.condition} onChange={(newValue: string) => handleTierAttributeChange(newValue, index, 'condition')} />
                                                <TextField label='Frequency' name={'tierfrequency_' + index} requiredIndicator value={criteria.frequency} onChange={(newValue: string) => handleTierAttributeChange(newValue, index, 'frequency')} autoComplete="off" />
                                                <Button variant="monochromePlain" onClick={() => { removeTierItem(index) }} disabled={tierCriteria?.length === 1} icon={MinusCircleIcon}></Button>
                                            </InlineStack>)}
                                            <Button submit={false} variant="primary" onClick={addItemToTier} icon={PlusCircleIcon}>Add More</Button>
                                        </FormLayout>
                                    ) : (
                                        <FormLayout>
                                            <Select options={tierOptions} label='Condition' name="nontiercondition" requiredIndicator value={nonTierCondition} onChange={handleNonTierConditionChange} />
                                            <TextField label='Frequency' name="nontierfrequency" requiredIndicator value={nonTierFrequency} onChange={handleNonTierFrequencyChange} autoComplete="off" />
                                        </FormLayout>
                                    )}
                                </FormLayout>
                            </Card>
                        </Layout.Section>
                        <Layout.Section variant="oneThird"></Layout.Section>
                    </Layout>
                    <InlineStack align="center" direction={'row'}>
                        <ButtonGroup gap="loose">
                            <Button variant="secondary" submit={false}>Cancel</Button>
                            <Button variant="primary" submit={true}>Save</Button>
                        </ButtonGroup>
                    </InlineStack>
                </BlockStack>
            </Form>
        </Page>
    );
}
