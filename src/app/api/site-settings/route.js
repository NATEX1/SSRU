import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        let settings = await prisma.siteSetting.findFirst();

        if (!settings) {
            // Create default settings if not exists
            settings = await prisma.siteSetting.create({
                data: {
                    nameTh: "วารสารแก้วเจ้าจอมออนไลน์",
                },
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("GET SITE SETTINGS ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        console.log("PUT /api/site-settings called");
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            console.log("Unauthorized access attempt");
            return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
        }

        const body = await req.json();
        console.log("Request body parsed", body);

        // Find the first settings record
        let settings = await prisma.siteSetting.findFirst();

        let updatedSettings;
        if (settings) {
            console.log("Updating existing settings, ID:", settings.id);
            updatedSettings = await prisma.siteSetting.update({
                where: { id: settings.id },
                data: {
                    nameTh: body.nameTh,
                    nameEn: body.nameEn,
                    nameCn: body.nameCn,
                    logo: body.logo,
                    phone: body.phone,
                    email: body.email,
                    googleMapLink: body.googleMapLink,

                    addressTh: body.addressTh,
                    addressEn: body.addressEn,
                    addressCn: body.addressCn,

                    officeHoursTh: body.officeHoursTh,
                    officeHoursEn: body.officeHoursEn,
                    officeHoursCn: body.officeHoursCn,
                },
            });
        } else {
            console.log("Creating new settings");
            updatedSettings = await prisma.siteSetting.create({
                data: {
                    nameTh: body.nameTh,
                    nameEn: body.nameEn,
                    nameCn: body.nameCn,
                    logo: body.logo,
                    phone: body.phone,
                    email: body.email,
                    googleMapLink: body.googleMapLink,

                    addressTh: body.addressTh,
                    addressEn: body.addressEn,
                    addressCn: body.addressCn,

                    officeHoursTh: body.officeHoursTh,
                    officeHoursEn: body.officeHoursEn,
                    officeHoursCn: body.officeHoursCn,
                },
            });
        }

        console.log("Settings updated successfully");
        return NextResponse.json({ success: true, data: updatedSettings });
    } catch (error) {
        console.error("PUT SITE SETTINGS ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error: " + error.message },
            { status: 500 }
        );
    }
}
