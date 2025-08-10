import { TreeSubmissionForm } from "@/components/forms/tree-submission-form";

export default function SubmitPage() {
    return (
        <div className="container mx-auto max-w-7xl py-8 px-4">
            <div className="space-y-2 mb-8 text-center">
                <h1 className="text-3xl font-bold font-headline">Zgłoś nowe drzewo</h1>
                <p className="text-muted-foreground">
                    Pomóż nam zmapować pomniki przyrody na świecie. Wypełnij poniższy formularz, aby dodać nowe drzewo do naszej bazy danych.
                </p>
            </div>
            <TreeSubmissionForm />
        </div>
    );
}
